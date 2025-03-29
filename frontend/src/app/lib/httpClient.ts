import axios from "axios";
import { KLine, Ticker, Trade } from "./types";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getTicker(market: string): Promise<Ticker | null> {
  const tickers = await getTickers();
  return tickers.find((t) => t.symbol === market) || null;
}

export async function getTickers(): Promise<Ticker[]> {
  //   await new Promise((resolve) => {
  //     setTimeout(resolve, 1000);
  //   });

  const res = await axios.get<Ticker[]>(`${BASE_URL}tickers`);

  return res.data;
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

  const data: KLine[] = response.data as KLine[];
  return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}

export async function getDepth(market: string): Promise<Depth> {
  const url  = `${BASE_URL}depth?symbol=${market}`
  console.log(url)
  const response = await axios.get(url);
  return response.data;
}

export async function getTrades(market: string): Promise<Trade[]> {
  const response = await axios.get(`${BASE_URL}trades?symbol=${market}`);
  const data: Trade[] = response.data as Trade[];
  return data;
}
