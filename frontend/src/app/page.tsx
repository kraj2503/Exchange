"use client"
import { useEffect, useState } from "react";
import { getTicker } from "./lib/httpClient";
import { Ticker } from "./lib/types";

export default function Home() {
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const [singleTicker, setSingleTicker] = useState<Ticker | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const allTickers = await getTicker();
        setTickers(allTickers);

        if (allTickers.length > 0) {
          const market = allTickers[0].symbol; // Test with first ticker
          const tickerData = await getTicker(market);
          setSingleTicker(tickerData);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }

    fetchData();
  }, []);

  return (
    <>
      This is landing page
      <div>
        <h1>Test API Calls</h1>
        <h2>All Tickers</h2>
        <ul>
          {/* {tickers.map((ticker) => (
            <li key={ticker.symbol}>
              {ticker.symbol}: {ticker.lastPrice}
            </li>
          ))} */}
        </ul>
        <h2>Single Ticker</h2>
        {singleTicker ? (
          <p>
            {singleTicker.symbol}: {singleTicker.lastPrice}
          </p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
}
