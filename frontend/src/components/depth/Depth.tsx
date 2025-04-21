"use client";

import { getDepth } from "@/app/lib/httpClient";
import { useEffect, useState } from "react";
import { AskTable } from "./askTable";
import { BidTable } from "./bidTable";
import { SignalingManager } from "@/utils/SignallingServer";

export function Depth({ market }: { market: string }) {
  const [bids, setBids] = useState<[string, string][]>([]);
  const [ask, setAsk] = useState<[string, string][]>([]);

  useEffect(() => {
    const signaling = SignalingManager.getInstance();

    signaling.registerCallback(
      "DEPTH",
      (data: any) => {
        if (data.bids?.length) {
          setBids((originalBids) => {
            if (!originalBids) return [];

            const updated: [string, string][] = originalBids.map(
              ([price, quantity]) => {
                const match = data.bids.find(
                  (b: [string, string]) => b[0] === price
                );
                return match ? [match[0], match[1]] : [price, quantity];
              }
            );

            return updated;
          });
        }

        if (data.asks?.length) {
          setAsk((originalAsks) => {
            if (!originalAsks) return [];

            const updated: [string, string][] = originalAsks.map(
              ([price, quantity]) => {
                const match = data.asks.find(
                  (a: [string, string]) => a[0] === price
                );
                return match ? [match[0], match[1]] : [price, quantity];
              }
            );

            return updated;
          });
        }
      },
      `DEPTH@${market}`
    );

    signaling.sendMessage({
      method: "SUBSCRIBE",
      params: [`DEPTH@${market}`],
    });

    getDepth(market).then((d) => {
      setAsk(d.payload.asks);
      setBids(d.payload.bids);
    });

    return () => {
      signaling.sendMessage({
        method: "UNSUBSCRIBE",
        params: [`DEPTH@${market}`],
      });
      signaling.deRegisterCallback("DEPTH", `DEPTH@${market}`);
    };
  }, [market]);

  return (
    <div>
      <TableHeader />
      {ask.length > 0 && <AskTable ask={ask} />}
      <div className="">----------------------------------</div>
      {bids.length > 0 && <BidTable bids={bids} />}
    </div>
  );
}

function TableHeader() {
  return (
    <div className="flex justify-between text-xs p-2 pb-1">
      <div className="text-white">Price</div>
      <div className="text-slate-500">Size</div>
      <div className="text-slate-500">Total</div>
    </div>
  );
}
