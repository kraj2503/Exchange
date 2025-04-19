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
import { ORDER_UPDATE, TRADE_ADDED } from "../types";

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
      console.log("Found Snapshot");
      const snapShotsnapShot = JSON.parse(snapShot.toString());
      console.log("parsed Snapshot");
      this.orderBook = snapShotsnapShot.orderbooks.map((o: any) => {
        return new OrderBook(
          o.baseAsset,
          o.bids,
          o.asks,
          o.lastTradeId,
          o.currentPrice
        );
      });
      console.log("Orderbook Created");
      this.balances = new Map(snapShotsnapShot.balances);
      console.log("Balances Executed", this.balances);
    } else {
      console.log("Creating a new OrderBook");
      this.orderBook = [
        new OrderBook(`ETH`, [], [], 0, 0),
        new OrderBook("BTC", [], [], 0, 0),
      ];
      console.log("new OrderBook,", this.orderBook);
      this.setBaseBalances();
    }
    setInterval(() => {
      this.saveSnapshot();
    }, 1000 * 3);
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
          console.log("Error while cancelling order");
          console.log(e);
        }
        break;
      case GET_OPEN_ORDERS:
        try {
          const market = message.data.market;
          console.log("inside get_open_orders");
          const openOrderbook = this.orderBook.find(
            (o) => o.ticker() == market
          );
          if (!openOrderbook) {
            console.log(this.orderBook);
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
        console.log("Engine got ", userId, amount);
        const { available, locked } = this.onRamp(userId, amount) || {
          available: 0,
          locked: 0,
        };
        RedisManager.getInstance().sendToApi(clientId, {
          type: "ON_RAMP",
          payload: {
            available: available,
            locked: locked,
          },
        });
        break;
      case GET_DEPTH:
        try {
          const market = message.data.market;
          console.log("market", market);
          const orderbook = this.orderBook.find((o) => o.ticker() === market);
          console.log("orderbok", orderbook);
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
    console.log("Creating Order for Market:", market);
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
    console.log(`order is ${order}`);

    const { fills, executedQty } = orderbook.addOrder(order);
    this.updateBalance(userId, baseAsset, quoteAsset, side, fills);

    console.log(`fills: ${fills}, executedQty: ${executedQty}`);
    
    this.createDbTrades(fills, market, userId);
    console.log(`Db trades executed`);
    
    this.updateDbOrders(order, executedQty, fills, market);
    console.log(`Db update executed`);
    // this.publisWsDepthUpdates(fills, price, side, market);
    this.publishWsTrades(fills, userId, market);
    console.log(`ws published`);
    
    return { executedQty, fills, orderId: order.orderId };
  }
  createDbTrades(fills: Fill[], market: string, userId: string) {
    console.log("creating Db Trade")
    fills.forEach((fill) => {
      RedisManager.getInstance().pushMessage({
        type: TRADE_ADDED,
        data: {
          market: market,
          id: fill.tradeId.toString(),
          isBuyerMaker: fill.otherUserId === userId,
          price: fill.price,
          quantity: fill.qty.toString(),
          quoteQuantity: (fill.qty * Number(fill.price)).toString(),
          timestamp: Date.now().toString(),
        },
      });
    });
  }
  publishWsTrades(fills: Fill[], userId: string, market: string) {
   console.log(`inside ws trade`);
   console.log(`fills:`,fills);
   
    fills.forEach((fill) => {
      console.log(`publishing msg for ${market}, fill: ${fill}`);
      
      RedisManager.getInstance().publishMessage(`trade@${market}`, {
        stream: `trade@${market}`,
        data: {
          e: "trade",
          t: fill.tradeId,
          m: fill.otherUserId === userId,
          p: fill.price,
          q: fill.qty.toString(),
          s: market,
        },
      });
    });
  }

  publisWsDepthUpdates(
    fills: Fill[],
    price: string,
    side: "buy" | "sell",
    market: string
  ) {
    const orderbook = this.orderBook.find((o) => o.ticker() === market);
    if (!orderbook) {
      return;
    }
    const depth = orderbook.getDepth();
    if (side === "buy") {
      const updatedAsks = depth?.asks.filter((x) =>
        fills.map((f) => f.price).includes(x[0].toString())
      );
      const updatedBid = depth?.bids.find((x) => x[0] === price);
      console.log("publish ws depth updates");
      RedisManager.getInstance().publishMessage(`depth@${market}`, {
        stream: `depth@${market}`,
        data: {
          a: updatedAsks,
          b: updatedBid ? [updatedBid] : [],
          e: "depth",
        },
      });
    }
    if (side === "sell") {
      const updatedBids = depth?.bids.filter((x) =>
        fills.map((f) => f.price).includes(x[0].toString())
      );
      const updatedAsk = depth?.asks.find((x) => x[0] === price);
      console.log("publish ws depth updates");
      RedisManager.getInstance().publishMessage(`depth@${market}`, {
        stream: `depth@${market}`,
        data: {
          a: updatedAsk ? [updatedAsk] : [],
          b: updatedBids,
          e: "depth",
        },
      });
    }
  }

  updateBalance(
    userId: string,
    baseAsset: string,
    quoteAsset: string,
    side: "buy" | "sell",
    fills: Fill[]
  ) {
    if (side === "buy") {
      fills.forEach((fill) => {
        const otherUserBalance = this.balances.get(fill.otherUserId);

        if (!otherUserBalance) {
          throw new Error(`User ${fill.otherUserId} not found`);
        }
        const quoteAssetBalance = otherUserBalance[quoteAsset];
        if (!quoteAssetBalance) {
          throw new Error(
            `Asset ${quoteAsset} not found for user ${fill.otherUserId}`
          );
        }
        quoteAssetBalance.available += fill.qty * parseFloat(fill.price);

        otherUserBalance[baseAsset].locked =
          otherUserBalance?.[baseAsset].locked - fill.qty;

        const userBalance = this.balances.get(userId);
        if (!userBalance) {
          throw new Error(`User ${userId} not found`);
        }
        userBalance[baseAsset].available =
          userBalance?.[baseAsset].available + fill.qty;
      });
    } else if (side === "sell") {
      fills.forEach((fill) => {
        const otherUserBalance = this.balances.get(fill.otherUserId);
        if (!otherUserBalance) {
          throw new Error("");
        }
        const userBalance = this.balances.get(userId);
        if (!userBalance) {
          throw new Error("");
        }
        otherUserBalance[quoteAsset].locked =
          otherUserBalance?.[quoteAsset].locked - fill.qty * Number(fill.price);

        userBalance[quoteAsset].available =
          userBalance?.[quoteAsset].available + fill.qty * Number(fill.price);

        // Update base asset balance

        //@ts-ignore
        otherUserBalance[baseAsset].available =
          otherUserBalance?.[baseAsset].available + fill.qty;

        //@ts-ignore
        userBalance[baseAsset].locked =
          userBalance?.[baseAsset].locked - fill.qty;
      });
    }
  }

  addOrderBook(orderBook: OrderBook) {
    this.orderBook.push(orderBook);
  }

  updateDbOrders(
    order: Order,
    executedQty: number,
    fills: Fill[],
    market: string
  ) {
    RedisManager.getInstance().pushMessage({
      type: ORDER_UPDATE,
      data: {
        orderId: order.orderId,
        executedQty: executedQty,
        market: market,
        price: order.price.toString(),
        quantity: order.quantity.toString(),
        side: order.side,
      },
    });
    fills.forEach((fill) => {
      RedisManager.getInstance().pushMessage({
        type: ORDER_UPDATE,
        data: {
          orderId: fill.marketOrderId,
          executedQty: fill.qty,
        },
      });
    });
  }

  saveSnapshot() {
    const snapshotSnapshot = {
      orderbooks: this.orderBook.map((o) => o.getSnapshot()),
      balances: Array.from(this.balances.entries()),
    };
    writeFileSync("./snapshot.json", JSON.stringify(snapshotSnapshot));
  }

  sendUpdatedDepthAt(price: string, market: string) {
    const orderbook = this.orderBook.find((o) => o.ticker() === market);
    if (!orderbook) {
      return;
    }

    const depth = orderbook.getDepth();
    const updatedBids = depth?.bids.filter((x) => x[0] === price);
    const updatedAsks = depth?.asks.filter((x) => x[0] === price);

    RedisManager.getInstance().publishMessage(`depth@${market}`, {
      stream: `depth@${market}`,
      data: {
        a: updatedAsks.length ? updatedAsks : [[price, "0"]],
        b: updatedBids.length ? updatedAsks : [[price, "0"]],
        e: "depth",
      },
    });
  }

  setBaseBalances() {
    this.balances.set("1", {
      [BASE_CURRENCY]: {
        available: 10000000,
        locked: 0,
      },
      ETH: {
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
    this.balances.set("6", {
      [BASE_CURRENCY]: {
        available: 10000000,
        locked: 0,
      },
      TATA: {
        available: 10000000,
        locked: 0,
      },
      ETH: {
        available: 1000000,
        locked: 0,
      },
    });

    this.balances.set("3", {
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

  checkAndLockFunds(
    baseAsset: string,
    quoteAsset: string,
    side: "buy" | "sell",
    userId: string,
    price: string,
    quantity: string
  ) {
    const userBalance = this.balances.get(userId);
    console.log("baseAsset", baseAsset);
    console.log("quoteAsset", quoteAsset);
    if (!userBalance) {
      throw new Error(`User ${userId} not found`);
    }

    if (side == "buy") {
      if (
        (userBalance?.[quoteAsset]?.available || 0) <
        Number(quantity) * Number(price)
      ) {
        throw new Error("Insufficient Funds");
      }

      userBalance[quoteAsset].available =
        userBalance?.[quoteAsset].available - Number(quantity) * Number(price);

      userBalance[quoteAsset].locked =
        userBalance?.[quoteAsset].locked + Number(quantity) * Number(price);
    } else if (side == "sell") {
      if ((userBalance?.[baseAsset]?.available || 0) < Number(quantity)) {
        throw new Error("Insufficient Funds");
      }
      userBalance[baseAsset].available =
        userBalance?.[baseAsset].available - Number(quantity);

      userBalance[baseAsset].locked =
        userBalance?.[baseAsset].locked + Number(quantity);
    }
  }

  onRamp(userId: string, amount: number) {
    let UserBalance = this.balances.get(userId);
    if (!UserBalance) {
      console.log("user balance not found");
      UserBalance = {
        [BASE_CURRENCY]: {
          available: amount,
          locked: 0,
        },
      };
      this.balances.set(userId, UserBalance);
    } else {
      UserBalance[BASE_CURRENCY].available += amount;
    }
    return {
      available: UserBalance[BASE_CURRENCY].available ?? 0,
      locked: UserBalance[BASE_CURRENCY].locked ?? 0,
    };
  }
}
