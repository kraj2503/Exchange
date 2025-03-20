
export const AskTable = ({ ask }: { ask: [string, string][] }) => {
  let currentTotal = 0;
  const relevantAsk = ask.slice(0, 15);

  relevantAsk.reverse();

  const askWithtotal: [string, string, number][] = [];

  for (let i = 0; i < relevantAsk.length; i++) {
    const [price, quantity] = relevantAsk[i];
    askWithtotal.push([price, quantity, (currentTotal += Number(quantity))]);
  }
  const maxTotal = relevantAsk.reduce(
    (acc, [_, quantity]) => acc + Number(quantity),
    0
  );

  askWithtotal.reverse();

  return (
    <div>
        askTable
      {askWithtotal.map(([Price, quantity, total]) => (
        <Ask
          maxTotal={maxTotal}
          key={Price}
          price={Price}
          quantity={quantity}
          total={total}
        />
      ))}
    </div>
  );
};

function Ask({price, quantity, total, maxTotal}: {price: string, quantity: string, total: number, maxTotal: number}) {
        return <div
        style={{
            display: "flex",
            position: "relative",
            width: "100%",
            backgroundColor: "transparent",
            overflow: "hidden",
        }}
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
            }}
        ></div>
        <div className="flex justify-between text-xs w-full">
            <div>
                {price}
            </div>
            <div>
                {quantity}
            </div>
            <div>
                {total?.toFixed(2)}
            </div>
        </div>
        </div>
    }