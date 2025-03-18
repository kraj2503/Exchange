"use client";
import { useParams } from "next/navigation";
import useRedirect from "../../../../hooks/useRedirect";
import { useEffect, useState } from "react";
import { getTicker } from "@/app/lib/httpClient";
import TickerBar from "@/components/TickerBar";
import { Ticker } from "@/app/lib/types";
import { TradeUI } from "@/components/TradeUI";

export default function Page() {
  
  const [ticker, setTicker] = useState<Ticker | null>(null);
  const { market } = useParams<{ market: string }>();
 
  useRedirect();
  

  useEffect(() => {
    if (!market) return;
    async function fetchTicker() {
      try {
        const data = await getTicker(market);
        setTicker(data);
      } catch (error) {
        console.error("Error fetching ticker:", error);
        setTicker(null); // Reset ticker on error
      }
    }
    fetchTicker()
  }, [market]);
  return <div>
    
    <div className="bg-slate-950 h-screen text-white grid grid-cols-5 overflow-hidden">
        <div className="col-span-4 my-5 mx-3 ">
          <TickerBar
            symbol={ticker?.symbol ?? ""}
            firstPrice={ticker?.firstPrice ?? ""}
            lastPrice={ticker?.lastPrice ?? ""}
            priceChange={ticker?.priceChange ?? ""}
            priceChangePercent={ticker?.priceChangePercent ?? ""}
            volume={ticker?.volume ?? ""}
            high={ticker?.high ?? ""}
            low={ticker?.low ?? ""}
            quoteVolume={ticker?.quoteVolume ?? ""}
            trades={ticker?.trades ?? ""}
          />
        </div>
        <div className="col-span-1 overflow-">
          <TradeUI   lastprice={ticker?.lastPrice ?? ""} />
        </div>
      </div>

  </div>;
}
