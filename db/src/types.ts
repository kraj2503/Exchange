export type Dbmessage =
  | {
      type: "TRADE_ADDED";
      data: {
        id: String;
        isBuyerMaker: boolean;
        price: string;
        quantity: string;
        quoteQuantity: String;
        timestamp: number;
        market: string;
      };
    }
  | {
      type: "ORDER_UPDATE";
      data: {
        orderId: string;
        executedQty: number;
        market?: string;
        price?: string;
        quantity?: string;
        side?: "buy" | "sell";
      };
    };
