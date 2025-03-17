import { useState } from "react";
import { Button } from "./ui/button";

export const TradeUI = () => {
  const [selected, setSelected] = useState<"buy" | "sell">("buy");
  const [market, setMarket] = useState<"limit" | "market">("market");

  return (
    <div className="ml-2 border-2 border-gray-800 bg-gray-900 h-screen p-4">
      {/* Buy/Sell Toggle */}
      <div className="flex mx-3  justify-center rounded-xl">
        <button
          className={`px-24 py-3 rounded-md cursor-pointer transition font-semibold ${
            selected === "buy"
              ? "text-[var(--color-green-primary-button-text)] bg-teal-900"
              : "text-gray-300 bg-gray-700"
          }`}
          onClick={() => setSelected("buy")}
        >
          Buy
        </button>
        <button
          className={`px-24 py-3 rounded-md cursor-pointer transition font-semibold  ${
            selected === "sell"
              ? " bg-[var(--color-red-background-transparent)] text-[var(--color-red-primary-button-text)]"
              : " bg-gray-700 "
          }`}
          onClick={() => setSelected("sell")}
        >
          Sell
        </button>
      </div>

      <div className=" mt-2">
        <Button variant={'market'} onClick={()=>{setMarket("limit")}} >Limit</Button>
        <Button variant={'market'} onClick={()=>{setMarket("market")}}>Market</Button>
      </div>
      
    </div>
  );
};
