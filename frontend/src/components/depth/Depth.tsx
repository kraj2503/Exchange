"use client";

import { getDepth, getTicker } from "@/app/lib/httpClient";
import { useEffect, useState } from "react";
import { AskTable } from "./askTable";
import { BidTable } from "./bidTable";

export function Depth({ market }: { market: string }) {
  const [bids, setBids] = useState<[string, string][]>();
  const [ask, setAsk] = useState<[string, string][]>();
  const [price, setPrice] = useState<string>();

  useEffect(() => {
    getDepth(market).then((d) => {
      setBids(d.bids.reverse());
      setAsk(d.ask);
    });
    getTicker(market).then((t) => setPrice(t?.lastPrice));
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
