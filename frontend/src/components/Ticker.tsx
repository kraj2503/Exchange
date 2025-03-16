import { ChevronDown } from "lucide-react";

interface TickerProps {
  Ticker: string;
  FromTo: string;
  change: { number: number; percentage: number };
  high: string;
  low: string;
  volume: string;
}

const Ticker: React.FC<TickerProps> = ({ Ticker, FromTo, change, high, low, volume }) => {
  return (
    <div className="no-scrollbar w-full bg-gray-900 rounded-lg flex items-center px-5 py-3 shadow-md">
      {/* Trading Pair Dropdown */}
      <div className="flex items-center bg-gray-800 rounded-md px-3 py-2 hover:bg-gray-700 cursor-pointer transition">
        <span className="text-white font-medium">{FromTo}</span>
        <ChevronDown className="ml-2 text-gray-400" size={18} />
      </div>

      {/* Ticker Name */}
      <div className="flex flex-col text-sm ml-4">
        <p className="text-gray-400 text-xs">Ticker</p>
        <span className="font-semibold text-white">{Ticker}</span>
      </div>

      {/* 24H Stats (Aligned Left) */}
      <div className="flex flex-wrap justify-start ml-6 space-x-6">
        <Stat 
          label="24H Change" 
          value={`${change.number.toFixed(2)} (${change.percentage.toFixed(2)}%)`} 
          isPositive={change.number >= 0} 
        />
        <Stat label="24H High" value={high} />
        <Stat label="24H Low" value={low} />
        <Stat label="24H Volume" value={volume} />
      </div>
    </div>
  );
};

// Reusable component for stats
const Stat = ({ label, value, isPositive }: { label: string; value: string; isPositive?: boolean }) => (
  <div className="flex flex-col text-sm">
    <p className="text-gray-400 text-xs">{label}</p>
    <span className={`mt-1 font-medium tabular-nums text-lg ${isPositive !== undefined ? (isPositive ? "text-green-400" : "text-red-400") : "text-white"}`}>
      {value}
    </span>
  </div>
);

export default Ticker;
