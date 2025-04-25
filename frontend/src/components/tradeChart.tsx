import { getKlines } from "@/app/lib/httpClient";
import { KLine } from "@/app/lib/types";
import { Chartmanager } from "@/app/utils/ChartManager";
import { useEffect, useRef, useState } from "react";

export function TradeChart({ market }: { market: string }) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartManagerRef = useRef<Chartmanager | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const init = async () => {
    let klineData: KLine[] = [];
    setLoading(true); 
    setError(null); 

    try {
      klineData = await getKlines(
        market,
        "1m",
        Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 18) / 1000), 
        Math.floor(new Date().getTime() / 1000)
      );
    } catch (e) {
      console.log(e);
      setError("Failed to load chart data");
    }

    setLoading(false); 

    if (chartRef.current && klineData.length > 0) {
     
      if (chartManagerRef.current) {
        chartManagerRef.current.destroy();
      }

    
      const chartManager = new Chartmanager(
        chartRef.current,
        klineData
          .map((x) => ({
            close: parseFloat(x.close),
            high: parseFloat(x.high),
            low: parseFloat(x.low),
            open: parseFloat(x.open),
            timestamp: new Date(x.end),
          }))
          .sort((x, y) => (x.timestamp < y.timestamp ? -1 : 1)),
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

    return () => {
 
      if (chartManagerRef.current) {
        chartManagerRef.current.destroy();
      }
    };
  }, [market]); 

  return (
    <div>
      <div
        ref={chartRef}
        style={{ height: "520px", width: "100%", marginTop: 4 }}
      ></div>
      {loading && <div>Loading chart...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
