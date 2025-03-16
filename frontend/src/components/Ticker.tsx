interface TickerProps {
  FromTo: string;
  change: { number: number; percentage: number };
  high: string;
  low: string;
  volume: string;
}

const Ticker: React.FC<TickerProps> = ({
  FromTo,
  change,
  high,
  low,
  volume,
}) => {
        return <div>
                thius us ticker
        </div>
};

export default Ticker