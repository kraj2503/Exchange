import { ChevronDown } from "lucide-react";
import { Ticker } from "@/app/lib/types";

const TickerBar: React.FC<Ticker> = ({
  symbol,
  firstPrice,
  lastPrice,
  priceChange,
  priceChangePercent,
  quoteVolume,
  high,
  low,
}) => {
  // Formatting numbers with commas & fixed decimal places
  const formatNumber = (num: string | number, decimals = 2) => {
    return Number(num).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatChange = (num: string | number, decimals = 3) => {
    const n = Number(num);
    return `${n > 0 ? "+" : ""}${formatNumber(n, decimals)}`;
  };
  const priceChangeColor =
    Number(priceChange) >= 0 ? "text-green-400" : "text-red-400";

  return (
    <div className="no-scrollbar w-full bg-gray-900 rounded-lg flex items-center px-5 py-3 shadow-md">
      <div className="flex items-center bg-gray-800 rounded-md px-3 py-2 hover:bg-gray-700 cursor-pointer transition">
        <span className="text-white font-medium">{symbol}</span>
        <ChevronDown className="ml-2 text-gray-400" size={18} />
      </div>

      <div className="flex flex-col text-sm ml-4">
        <p className={`font-semibold  text-xl ${priceChangeColor}`}>
          {formatNumber(lastPrice, 2)}
        </p>
        <p className="text-gray-400 text-md">{formatNumber(firstPrice, 2)}</p>
      </div>

      <div className="flex flex-wrap justify-start ml-6 space-x-6">
        <Stat
          label="24H Change"
          value={`${formatChange(priceChange, 3)} ${formatChange(
            priceChangePercent,
            2
          )}%`}
          isPositive={Number(priceChange) >= 0}
        />
        <Stat label="24H High" value={formatNumber(high, 2)} />
        <Stat label="24H Low" value={formatNumber(low, 2)} />
        <Stat label="24H Volume" value={formatNumber(quoteVolume, 3)} />
      </div>
    </div>
  );
};

// Reusable component for stats
const Stat = ({
  label,
  value,
  isPositive,
}: {
  label: string;
  value: string;
  isPositive?: boolean;
}) => (
  <div className="flex flex-col text-sm">
    <p className="text-gray-400 text-sm">{label}</p>
    <span
      className={`mt-1 tabular-nums text-md  ${
        isPositive !== undefined
          ? isPositive
            ? "text-green-400"
            : "text-red-400"
          : "text-white"
      }`}
    >
      {value}
    </span>
  </div>
);

export default TickerBar;
