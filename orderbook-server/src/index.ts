import express from "express";
import { orderBookSchema } from "./types";
import { orderBook, bookWithQuantity } from "./orderBook";
import { isBoxedPrimitive } from "util/types";
const app: express.Application = express();
const PORT: number = 3000;

app.use(express.json());

interface Fill {
  price: number;
  qty: number;
  tradeId: number;
}

const BASE_ASSET = "BTC";
const QUOTE_ASSET = "USD";
let GLOBAL_TRADE_ID = 0;

app.post("/api/v1/signup", (req, res) => {
  res.json({});
});

app.post("/api/v1/signin", (req, res) => {});

app.post("/api/v1/order", (req, res) => {
  const order = orderBookSchema.safeParse(req.body);
  if (!order.success) {
    res.status(400).send(order.error);
    return;
  }
  const { baseAsset, quoteAsset, price, quantity, side, kind } = order.data;

  const orderId = (Math.random() * 100)?.toString();
  console.log(orderId);

  if (baseAsset !== BASE_ASSET || quoteAsset !== QUOTE_ASSET) {
        res.status(400).send('Invalid base or quote asset');
        return;
      }
  const { executedquantity, fills } = fillOrder(
    orderId,
    price,
    quantity,
    side,
    kind
  );

  res.send({
    orderId,
    executedquantity,
    fills,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const fillOrder = (
  orderId: string,
  price: number,
  quantity: number,
  side: "bid" | "ask",
  type?: "ioc"
): {
  status: "rejected" | "accepted";
  executedquantity: number;
  fills: Fill[];
} => {
  const fills: Fill[] = [];
  const maxFillQuantity = getFillAmount(price, quantity, side);
  let executed = 0;

  if (type === "ioc" && maxFillQuantity < quantity) {
    return { status: "rejected", executedquantity: maxFillQuantity, fills: [] };
  }

  if (side === "bid") {
    orderBook.Ask = orderBook.Ask.sort();
    orderBook.Ask.forEach((o) => {
      if (o.price < price && quantity > 0) {
        console.log("Filling ask");
        const filledQuantity = Math.min(quantity, o.quantity);
        console.log(filledQuantity);
        o.quantity -= filledQuantity;
        bookWithQuantity.asks[o.price] =
          (bookWithQuantity.asks[o.price] || 0) - filledQuantity;
        fills.push({
          price: o.price,
          qty: filledQuantity,
          tradeId: GLOBAL_TRADE_ID++,
        });
        executed += filledQuantity;
        quantity -= filledQuantity;
        if (o.quantity === 0) {
          orderBook.Ask.splice(orderBook.Ask.indexOf(o), 1);
        }
        if (bookWithQuantity.asks[price] === 0) {
          delete bookWithQuantity.asks[price];
        }
      }
    });

    if (quantity !== 0) {
      orderBook.Bid.push({
        price,
        quantity: quantity - executed,
        side: "bid",
        orderId,
      });
      bookWithQuantity.bids[price] =
        (bookWithQuantity.bids[price] || 0) + (quantity - executed);
    }
  } else {
    orderBook.Bid.forEach((o) => {
      if (o.price >= price && quantity > 0) {
        const filledQuantity = Math.min(quantity, o.quantity);
        o.quantity -= filledQuantity;
        bookWithQuantity.bids[price] =
          (bookWithQuantity.bids[price] || 0) - filledQuantity;
        fills.push({
          price: o.price,
          qty: filledQuantity,
          tradeId: GLOBAL_TRADE_ID++,
        });
        executed += filledQuantity;
        quantity -= filledQuantity;
        if (o.quantity == 0) {
          orderBook.Bid.splice(orderBook.Bid.indexOf(o), 1);
        }
        if (bookWithQuantity.bids[price] === 0) {
          delete bookWithQuantity.bids[price];
        }
      }
    });
    if (quantity !== 0) {
      orderBook.Ask.push({
        price,
        quantity: quantity,
        side: "ask",
        orderId,
      });
      bookWithQuantity.asks[price] =
        (bookWithQuantity.asks[price] || 0) + quantity;
    }
  }
// console.log("orderBook",orderBook)
console.log("bookWithQuantity",bookWithQuantity)
  return {
    status: "accepted",
    executedquantity:executed,
    fills,
  };
};

const getFillAmount = (
  price: number,
  quantity: number,
  side: "bid" | "ask"
): number => {
  let filled = 0;
  if (side === "bid") {
    orderBook.Ask.forEach((o) => {
      console.log(o.price);
      if (o.price <= price) {
        filled += Math.min(quantity, o.quantity);
      }
    });
  } else {
    orderBook.Bid.forEach((o) => {
      if (price < o.price) {
        filled += Math.min(quantity, o.quantity);
      }
    });
  }
  return filled;
};
