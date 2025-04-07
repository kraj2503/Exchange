import { StringifyOptions } from "node:querystring";
import { RedisManager } from "../redisManager";
import {
  CANCEL_ORDER,
  CREATE_ORDER,
  GET_DEPTH,
  GET_OPEN_ORDERS,
  MessageFromApi,
} from "../types/fromApi";
import { ON_RAMP } from "../types/toApi";
import { Fill, Order, OrderBook } from "./orderBook";
import { readFileSync, writeFileSync } from "node:fs";
import { ORDER_UPDATE } from "../types";

interface UserBalance {
  [key: string]: {
    available: number;
    locked: number;
  };
}

export const BASE_CURRENCY = "INR";
export class Engine {
  private orderBook: OrderBook[] = [];
  private balances: Map<string, UserBalance> = new Map();

  constructor() {
    let snapShot = null;
    try {
      if (process.env.WITH_SNAPSHOT) {
        snapShot = readFileSync("./snapshot.json");
      }
    } catch (e) {
      console.log("No Snapshot Found");
    }

    if (snapShot) {
      const snapShotsnapShot = JSON.parse(snapShot.toString());
      this.orderBook = snapShotsnapShot.orderBook.map((o: any) => {
        new OrderBook(
          o.baseAsset,
          o.bids,
          o.asks,
          o.lastTradeId,
          o.currentPrice
        );
      });
      this.balances = new Map(snapShotsnapShot.balances);
    } else {
      this.orderBook = [new OrderBook(`ETH`, [], [], 0, 0)];
      this.setBaseBalances();
    }
  }

  process({
    message,
    clientId,
  }: {
    message: MessageFromApi;
    clientId: string;
  }) {
    switch (message.type) {
      case CREATE_ORDER:
        try {
          const { executedQty, fills, orderId } = this.createOrder(
            message.data.market,
            message.data.price,
            message.data.quantity,
            message.data.side,
            message.data.userId
          );
          RedisManager.getInstance().sendToApi(clientId, {
            type: "ORDER_PLACED",
            payload: {
              orderId,
              executedQty,
              fills,
            },
          });
        } catch (e) {
          console.log(e);
          RedisManager.getInstance().sendToApi(clientId, {
            type: "ORDER_CANCELLED",
            payload: {
              orderId: "",
              executedQty: 0,
              remainingQty: 0,
            },
          });
        }
        break;
      case CANCEL_ORDER:
        try {
          const orderId = message.data.orderId;
          const cancelMarket = message.data.market;
          const cancelOrderbook = this.orderBook.find(
            (o) => o.ticker() === cancelMarket
          );
          const quoteAsset = cancelMarket.split("_")[1];
          if (!cancelOrderbook) {
            throw new Error("No OrderBook Found");
          }

          const order =
            cancelOrderbook.asks.find((o) => o.orderId === orderId) ||
            cancelOrderbook.bids.find((o) => o.orderId === orderId);
          if (!order) {
            console.log("No Order Found");
            throw new Error("No order Found");
          }

          if (order.side === "buy") {
            const price = cancelOrderbook.cancelBid(order);
            const leftQuantity = (order.quantity - order.filled) * order.price;
            //@ts-ignore
            this.balances.get(order.userId)[BASE_CURRENCY].available +=
              leftQuantity;
            //@ts-ignore
            this.balances.get(order.userId)[BASE_CURRENCY].locked -=
              leftQuantity;
            if (price) {
              this.sendUpdatedDepthAt(price.toString(), cancelMarket);
            }
          } else {
            const price = cancelOrderbook.cancelAsk(order);
            const leftQuantity = order.quantity - order.filled;
            //@ts-ignore
            this.balances.get(order.userId)[quoteAsset].available +=
              leftQuantity;
            //@ts-ignore
            this.balances.get(order.userId)[quoteAsset].locked -= leftQuantity;
            if (price) {
              this.sendUpdatedDepthAt(price.toString(), cancelMarket);
            }
          }
          RedisManager.getInstance().sendToApi(clientId, {
            type: "ORDER_CANCELLED",
            payload: {
              orderId,
              executedQty: 0,
              remainingQty: 0,
            },
          });
        } catch (e) {
          console.log("Error hwile cancelling order");
          console.log(e);
        }
        break;
      case GET_OPEN_ORDERS:
        try {
          const openOrderbook = this.orderBook.find(
            (o) => o.ticker() === message.data.market
          );
          if (!openOrderbook) {
            throw new Error("No orderbook found");
          }
          const openOrders = openOrderbook.getOpenOrders(message.data.userId);

          RedisManager.getInstance().sendToApi(clientId, {
            type: "OPEN_ORDERS",
            payload: openOrders,
          });
        } catch (e) {
          console.log(e);
        }
        break;
      case ON_RAMP:
        const userId = message.data.userId;
        const amount = Number(message.data.amount);
        this.onRamp(userId, amount);
        break;
      case GET_DEPTH:
        try {
          const market = message.data.market;
          const orderbook = this.orderBook.find((o) => o.ticker() === market);
          if (!orderbook) {
            throw new Error("No orderbook found");
          }
          RedisManager.getInstance().sendToApi(clientId, {
            type: "DEPTH",
            payload: orderbook.getDepth(),
          });
        } catch (e) {
          console.log(e);
          RedisManager.getInstance().sendToApi(clientId, {
            type: "DEPTH",
            payload: {
              bids: [],
              asks: [],
            },
          });
        }
        break;
    }
  }

  createOrder(
    market: string,
    price: string,
    quantity: string,
    side: "buy" | "sell",
    userId: string
  ) {
    const orderbook = this.orderBook.find((o) => o.ticker() === market);
    const baseAsset = market.split("_")[0];
    const quoteAsset = market.split("_")[1];

    if (!orderbook) {
      throw new Error("No orderbook found");
    }

    this.checkAndLockFunds(
      baseAsset,
      quoteAsset,
      side,
      userId,
      quoteAsset,
      price,
      quantity
    );

    const order: Order = {
      price: Number(price),
      quantity: Number(quantity),
      orderId:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      filled: 0,
      side,
      userId,
    };

    const { fills, executedQty } = orderbook.addOrder(order);
    this.updateBalance(userId, baseAsset, quoteAsset, side, fills, executedQty);

    this.createDbTrades(fills, market, userId);
    this.updateDbOrders(order, executedQty, fills, market);
    this.publisWsDepthUpdates(fills, price, side, market);
    this.publishWsTrades(fills, userId, market);
    return { executedQty, fills, orderId: order.orderId };
  }

  addOrderBook(orderBook:OrderBook){
    this.orderBook.push(orderBook)
  }

 updateDbOrders(order:Order,executedQty:number, fills:Fill[],market:string){
    RedisManager.getInstance().pushMessage({
        type:ORDER_UPDATE,
        data:{
            orderId:order.orderId,
            executedQty:executedQty,
            market:market,
            price:order.price.toString(),
            quantity:order.quantity.toString(),
            side:order.side
        }
    })
fills.forEach(fill =>{
    RedisManager.getInstance().pushMessage({
        type:ORDER_UPDATE,
        data:{
            orderId:fill.marketOrderId,
            executedQty: fill.qty
        }
    })
})

 }




  saveSnapshot() {
    const snapshotSnapshot = {
      orderbooks: this.orderBook.map((o) => o.getSnapshot()),
      balances: Array.from(this.balances.entries()),
    };
    writeFileSync("./snapshot.json", JSON.stringify(snapshotSnapshot));
  }

  setBaseBalances() {
    this.balances.set("1", {
      [BASE_CURRENCY]: {
        available: 10000000,
        locked: 0,
      },
      TATA: {
        available: 10000000,
        locked: 0,
      },
    });

    this.balances.set("2", {
      [BASE_CURRENCY]: {
        available: 10000000,
        locked: 0,
      },
      TATA: {
        available: 10000000,
        locked: 0,
      },
    });

    this.balances.set("5", {
      [BASE_CURRENCY]: {
        available: 10000000,
        locked: 0,
      },
      ETH: {
        available: 10000000,
        locked: 0,
      },
    });
  }
}
