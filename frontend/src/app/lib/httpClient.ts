import axios from "axios";
import { KLine, Ticker, Trade } from "./types";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;


export async function createOrderToApi(symbol:string,selected:string,price:string,quantity:string) {
  console.log(`market`,symbol);
  console.log(`selected`,selected);
  console.log(`price`,price);
  console.log(`quantity`,quantity);
 const res = await axios.post(`${BASE_URL}order`,{
 
    market:symbol,
    price:price,
    quantity:quantity,
    side:selected,
    userId:"1"
  
 })
  
return res.data

  
}
export async function getTicker(market: string): Promise<Ticker | null> {
  const res = await axios.get<Ticker>(`${BASE_URL}ticker`);

  const raw = res.data;
  return {
    symbol: market,
    firstPrice: "", // Add if you store this in DB
    lastPrice: raw.currentPrice.toFixed(2),
    priceChange: raw.change24H.value,
    priceChangePercent: raw.change24H.percentage,
    high: raw.high24H.toFixed(2),
    low: raw.low24H.toFixed(2),
    volume: raw.volume24H.toFixed(3),
    quoteVolume: "", // optional
    trades: "", // optional
  };
}



export async function getKlines(
  market: string,
  interval: string,
  startTime: number,
  endTime: number
): Promise<KLine[]> {
  console.log(BASE_URL);
  
  const response = await axios.get(
    `${BASE_URL}klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`
  );

  console.log("API Response:", response.data);

  const data: KLine[] = response.data as KLine[];
  return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}

export async function getDepth(market: string): Promise<Depth> {
  const url = `${BASE_URL}depth?symbol=${market}`;
  const response = await axios.get(url);
  return response.data;
}

export async function getTrades(market: string): Promise<Trade[]> {
  const response = await axios.get(`${BASE_URL}trades?symbol=${market}`);
  const data: Trade[] = response.data as Trade[];
  return data;
}
