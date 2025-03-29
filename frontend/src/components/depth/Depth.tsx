"use client";

import { getDepth, getTicker, getTrades } from "@/app/lib/httpClient";
import { useEffect, useState } from "react";
import { AskTable } from "./askTable";
import { BidTable } from "./bidTable";
import { SignalingManager } from "@/utils/SignallingServer";

export function Depth({ market }: { market: string }) {
  const [bids, setBids] = useState<[string, string][]>();
  const [ask, setAsk] = useState<[string, string][]>();
  const [price, setPrice] = useState<string>();

  useEffect(() => {
    SignalingManager.getInstance().registerCallback(
      "depth",
      (data: any) => {
        if (data.bids.length) {
          setBids((originalBids) => {
            const bidsAfterUpdate = [...(originalBids || [])];

            for (let i = 0; i < bidsAfterUpdate.length; i++) {
              for (let j = 0; j < data.bids.length; j++) {
                if (bidsAfterUpdate[i][0] === data.bids[j][0]) {
                  bidsAfterUpdate[i][1] = data.bids[j][1];
                  break;
                }
              }
            }
            return bidsAfterUpdate;
          });
        }
        if (data.asks.length) {
          setAsk((originalAsks) => {
            const asksAfterUpdate = [...(originalAsks || [])];

            for (let i = 0; i < asksAfterUpdate.length; i++) {
              for (let j = 0; j < data.asks.length; j++) {
                if (asksAfterUpdate[i][0] === data.asks[j][0]) {
                  asksAfterUpdate[i][1] = data.asks[j][1];
                  break;
                }
              }
            }
            return asksAfterUpdate;
          });
        }
      },
      `DEPTH-${market}`
    );

    SignalingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`depth.${market}`],
    });

    getDepth(market).then((d) => {
      setBids(d.bids.reverse());
      setAsk(d.asks);
    });
    getTicker(market).then((t) => setPrice(t?.lastPrice));
    getTrades(market).then((t) => setPrice(t[0].price));
    return () => {
      SignalingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`depth.200ms.${market}`],
      });
      SignalingManager.getInstance().deRegisterCallback(
        "depth",
        `DEPTH-${market}`
      );
    };
  }, []);

  return (
    <div>
      <TableHeader />
      {ask && <AskTable ask={ask} />}
      {price && <div>{price}</div>}
      {bids && <BidTable bids={bids} />}
    </div>
  );
}

function TableHeader() {
  return (
    <div className="flex justify-between text-xs">
      <div className="text-white">Price</div>
      <div className="text-slate-500">Size</div>
      <div className="text-slate-500">Total</div>
    </div>
  );
}
