interface Order {
  price: number;
  quantity: number;
  orderId: string;
}

interface Bid extends Order {
  side: "bid";
}
interface Ask extends Order {
  side: "ask";
}

export const orderBook: { Bid: Bid[]; Ask: Ask[] } = {
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
