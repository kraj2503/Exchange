import { RedisManager } from "../redisManager";
import { CREATE_ORDER, MessageFromApi } from "../types/fromApi";
import { Order, OrderBook } from "./orderBook";
import { readFileSync, writeFileSync } from "node:fs";

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
