import { OrderBook } from "./orderBook";
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
