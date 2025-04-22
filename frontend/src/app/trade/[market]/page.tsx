"use client";
import { useParams } from "next/navigation";
import useRedirect from "../../../../hooks/useRedirect";
import { useEffect, useState } from "react";
import { getTicker } from "@/app/lib/httpClient";
import TickerBar from "@/components/TickerBar";
import { Ticker } from "@/app/lib/types";
import { TradeUI } from "@/components/TradeUI";
import { TradeChart } from "@/components/tradeChart";
import { Depth } from "@/components/depth/Depth";
import { SignalingManager } from "@/utils/SignallingServer";

export default function Page() {
  const [ticker, setTicker] = useState<Ticker | null>(null);
  const { market } = useParams<{ market: string }>();

  // useRedirect();

  useEffect(() => {
    getTicker(market).then(setTicker);

    SignalingManager.getInstance().registerCallback(
      "ticker",
      (data: Partial<Ticker>) =>
        setTicker((prevTicker) => ({
          firstPrice: data?.firstPrice ?? prevTicker?.firstPrice ?? "",
          high: data?.high ?? prevTicker?.high ?? "",
          lastPrice: data?.lastPrice ?? prevTicker?.lastPrice ?? "",
          low: data?.low ?? prevTicker?.low ?? "",
          priceChange: data?.priceChange ?? prevTicker?.priceChange ?? "",
          priceChangePercent:
            data?.priceChangePercent ?? prevTicker?.priceChangePercent ?? "",
          quoteVolume: data?.quoteVolume ?? prevTicker?.quoteVolume ?? "",
          symbol: data?.symbol ?? prevTicker?.symbol ?? "",
          trades: data?.trades ?? prevTicker?.trades ?? "",
          volume: data?.volume ?? prevTicker?.volume ?? "",
        })),
      `TICKER-${market}`
    );
    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`ticker.${market}`],
    });

    return () => {
      SignalingManager.getInstance().deRegisterCallback(
        "ticker",
        `TICKER-${market}`
      );
      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`ticker.${market}`],
      });
    };

    // if (!market) return;
    // async function fetchTicker() {
    //   try {
    //     const data = await getTicker(market);
    //     setTicker(data);
    //   } catch (error) {
    //     console.error("Error fetching ticker:", error);
    //     setTicker(null); // Reset ticker on error
    //   }
    // }
    // fetchTicker();
  }, [market]);
  return (
    <div>
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

          <div className="flex   border-y border-slate-800 mt-8">
            <div className="w-[250px] flex-1/3 pr-3 pt-3 border-2 border-gray-800">
              <TradeChart market={market as string} />
            </div>
            <div className="flex flex-col w-[250px] overflow-hidden">
              <Depth market={market as string} />
            </div>
          </div>
        </div>
        <div className="col-span-1 overflow-">
          <TradeUI lastprice={ticker?.lastPrice ?? ""} symbol={market as string}/>
        </div>
      </div>
    </div>
  );
}
