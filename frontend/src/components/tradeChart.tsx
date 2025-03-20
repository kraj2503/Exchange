import { getKlines } from "@/app/lib/httpClient";
import { KLine } from "@/app/lib/types";
import { Chartmanager } from "@/app/utils/ChartManager";
import { useEffect, useRef } from "react";

export function TradeChart({ market }: { market: string }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<Chartmanager>(null);

  const init = async () => {
    let klineData: KLine[] = [];
    try {
      klineData = await getKlines(
        market,
        "1h",
        Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000),
        Math.floor(new Date().getTime() / 1000)
      );
    } catch (e) {
      console.log(e);
    }
    if (chartRef) {
      if (chartManagerRef.current) {
        chartManagerRef.current.destroy();
      }
      const chartManager = new Chartmanager(
        chartRef.current,
        [
          ...klineData?.map((x) => ({
            close: parseFloat(x.close),
            high: parseFloat(x.high),
            low: parseFloat(x.low),
            open: parseFloat(x.open),
            timestamp: new Date(x.end),
          })),
        ].sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)) || [],
        {
          background: "#0e0f14",
          color: "white",
        }
      );
      chartManagerRef.current = chartManager;
    }
  };

  useEffect(() => {
    init();
  }, [market, chartRef]);

  return (
    <>
      <div
        ref={chartRef}
        style={{ height: "520px", width: "100%", marginTop: 4 }}
      ></div>
    </>
  );
}
