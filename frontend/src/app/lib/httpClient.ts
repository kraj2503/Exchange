import axios from "axios";
import { Ticker } from "./types";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function getTicker(market: string): Promise<Ticker | null> {
  console.log("baseURL", BASE_URL);
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
