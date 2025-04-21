export type Ticker = {
  symbol: string;
  firstPrice: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  high: string;
  low: string;
  volume: string;
  quoteVolume: string;
  trades: string;
};

export interface KLine {
  close: string;
  end: string;
  high: string;
  low: string;
  open: string;
  quoteVolume: string;
  start: string;
  trades: string;
  volume: string;
}
export interface Depth {
  payload:{
    bids: [string, string][],
    asks: [string, string][],

    lastUpdateId: string
  }
}

export interface Trade {
  "id": number,
  "isBuyerMaker": boolean,
  "price": string,
  "quantity": string,
  "quoteQuantity": string,
  "timestamp": number
}