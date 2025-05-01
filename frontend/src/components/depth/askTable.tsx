export const AskTable = ({ ask }: { ask: [string, string][] }) => {
  const sortedAsk = [...ask]
    .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
    .slice(-15); // last 15 (highest price)

  let currentTotal = 0;
  const askWithTotal: [string, string, number][] = sortedAsk.map(
    ([price, quantity]) => [price, quantity, (currentTotal += Number(quantity))]
  );

  const maxTotal = askWithTotal[askWithTotal.length - 1]?.[2] ?? 0;

  return (
    <div>
      {askWithTotal.reverse().map(([price, quantity, total]) => (
        <Ask
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

function Ask({
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
      className="flex justify-between text-xs w-full py-[3px] relative "
      style={{ backgroundColor: "transparent" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${(100 * total) / maxTotal}%`,
          height: "100%",
          background: "rgba(228, 75, 68, 0.325)",
          transition: "width 0.3s ease-in-out",
          zIndex: 0,
        }}
      />
      <div className="flex justify-between text-xs w-full relative z-10 px-1 ">
        <div>{price}</div>
        <div>{quantity}</div>
        <div>{total.toFixed(2)}</div>
      </div>
    </div>
  );
}
