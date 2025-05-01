export const BidTable = ({ bids }: { bids: [string, string][] }) => {
  const sortedBids = [...bids]
    .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
    .slice(0, 15); // top 15 highest bids

  let currentTotal = 0;
  const bidsWithTotal: [string, string, number][] = sortedBids.map(
    ([price, quantity]) => [price, quantity, (currentTotal += Number(quantity))]
  );

  const maxTotal = bidsWithTotal[bidsWithTotal.length - 1]?.[2] ?? 0;

  return (
    <div>
      {bidsWithTotal.map(([price, quantity, total]) => (
        <Bid
          key={price}
          price={price}
          quantity={quantity}
          total={total}
          maxTotal={maxTotal}
        />
      ))}
    </div>
  );
};

function Bid({
  price,
  quantity,
  total,
  maxTotal,
}: {
  price: string;
  quantity: string;
  total: number;
  maxTotal: number;
}) {
  return (
    <div
      className="flex justify-between text-xs w-full py-[3px] relative"
      style={{ backgroundColor: "transparent" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${(100 * total) / maxTotal}%`,
          height: "100%",
          background: "rgba(1, 167, 129, 0.325)",
          transition: "width 0.3s ease-in-out",
          zIndex: 0,
        }}
      />
      <div className="flex justify-between text-xs w-full relative z-10 px-1">
        <div>{price}</div>
        <div>{quantity}</div>
        <div>{total.toFixed(2)}</div>
      </div>
    </div>
  );
}
