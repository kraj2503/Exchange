interface Order {
  price: number;
  quantity: number;
  orderId: String;
}

interface Bid extends Order {
  side: "bid";
}
interface Ask extends Order {
  side: "bid";
}

export const orderBook = {
  Bid: [],
  Ask: [],
};

export const bookWithQuantity: {
  bids: { [price: number]: number };
  asks: { [price: number]: number };
} = {
  bids: {},
  asks: {},
};
