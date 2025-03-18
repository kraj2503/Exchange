import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export const TradeUI = ({ lastprice }: { lastprice: string }) => {
  const [selected, setSelected] = useState<"buy" | "sell">("buy");
  const [market, setMarket] = useState<"limit" | "market">("market");
  const [price, setPrice] = useState<number>(0); // Start with 0
  const [quantity, setQuantity] = useState<number>(0);
  const [orderValue, setOrderValue] = useState<number>(0);

  useEffect(() => {
    if (!isNaN(Number(lastprice))) {
      setPrice(Number(lastprice));
    }
  }, [lastprice]);

  useEffect(() => {
    setOrderValue(price * quantity);
  }, [price, quantity]);

  // Function to handle numeric input
  const handleNumericInput =
    (setter: React.Dispatch<React.SetStateAction<number>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setter(isNaN(value) ? 0 : value);
    };

  return (
    <div className="ml-2 border-l-6 border-gray-800 bg-slate-950 h-screen p-4">
      <div className="flex mx-3 justify-center rounded-xl">
        <button
          className={`px-14 py-3 rounded-md cursor-pointer transition font-semibold hover:text-[var(--color-green-primary-button-text)] ${
            selected === "buy"
              ? "text-[var(--color-green-primary-button-text)] bg-teal-900"
              : "text-gray-300 bg-gray-700"
          }`}
          onClick={() => setSelected("buy")}
        >
          Buy
        </button>
        <button
          className={`px-14 py-3 rounded-md cursor-pointer transition font-semibold hover:text-[var(--color-red-primary-button-text)] ${
            selected === "sell"
              ? " bg-[var(--color-red-background-transparent)] text-[var(--color-red-primary-button-text)]"
              : " bg-gray-600 "
          }`}
          onClick={() => setSelected("sell")}
        >
          Sell
        </button>
      </div>

      <div className="mt-3">
        <button
          className={`${LimitMarket} ${
            market == "limit" ? "bg-gray-600" : "bg-bg-slate-950"
          }`}
          onClick={() => setMarket("limit")}
        >
          Limit
        </button>
        <button
          className={`${LimitMarket} ${
            market == "market" ? "bg-gray-600" : "bg-bg-slate-950"
          }`}
          onClick={() => setMarket("market")}
        >
          Market
        </button>
      </div>

      <div className="flex justify-between mx-1 mt-2 font-light">
        <div>Balance</div>
        <div>-</div>
      </div>

      <div className="flex justify-between mx-1 mt-2">
        <div className="font-light">Price</div>
        <div className="text-blue-400">Mid</div>
      </div>
      <div>
        <input
          placeholder="Price"
          className="bg-gray-600 h-12 rounded-md px-3 mt-4 min-w-full mr-2 
             ring-2 ring-transparent focus:ring-2 focus:ring-blue-500 
             outline-none transition-all duration-200"
          value={price}
          onChange={handleNumericInput(setPrice)}
        />
      </div>
      <div className="flex justify-start mx-1 mt-2">
        <div className="text-sm tracking-wide">Quantity</div>
      </div>
      <div>
        <input
          placeholder="Quantity"
          className="bg-gray-600 h-12 rounded-md px-3 mt-4 min-w-full mr-2 
             ring-2 ring-transparent focus:ring-2 focus:ring-blue-500 
             outline-none transition-all duration-200"
          value={quantity}
          onChange={handleNumericInput(setQuantity)}
        />
      </div>
      <div className="flex justify-start mx-1 mt-2">
        <div className="text-sm tracking-wide">Order Value</div>
      </div>
      <div>
        <input
          placeholder="Order Value"
          className="bg-gray-600 h-12 rounded-md px-3 mt-4 min-w-full mr-2 
             ring-2 ring-transparent focus:ring-2 focus:ring-blue-500 
             outline-none transition-all duration-200"
          value={orderValue}
          readOnly
        />
      </div>

      <div className="flex mt-4 ">
        <div className="flex ">
          <input type="checkbox" className="w-4 h-4 mt-1" />
          <div className="ml-1">Post Only</div>
        </div>

        <div className="flex ml-3">
          <input type="checkbox" className="w-4 h-4 mt-1" />
          <div className="flex">
            <div className="ml-1">IOC</div>
          </div>
        </div>
      </div>
      <div>
        <div className="mt-5 ">
                <Button variant={'default'} className="min-w-full h-12 text-xl tracking-wider hover:scale-110 transition duration-300 ease-in-out bg-gray-500">Place Order</Button>
        </div>
      </div>
    </div>
  );
};

const LimitMarket = "text-nowrap px-3 py-1 ml-2 mt-1 rounded-md";
