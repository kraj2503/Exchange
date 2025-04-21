import { Router } from "express";
import { Client } from "pg";
import { login } from "../login";

console.log(`login: `,login);

const pgClient = new Client(login);

pgClient.connect();

export const klineRouter = Router();

klineRouter.get("/", async (req: any, res: any) => {
  const { symbol, interval, startTime, endTime } = req.query;
  console.log(symbol, interval, startTime, endTime);
  if (!symbol || !startTime || !endTime || !interval) {
    return res.status(400).send("Missing required query parameters.");
  }
  let query;
  switch (interval) {
    case "1m":
      console.log("execurting 1 min");
      query = `
  SELECT * 
  FROM klines_1m
  WHERE bucket >= $1 AND bucket <= $2 AND currency_code = $3 
  
`;
      break;
    case "1h":
      console.log("execurting 1 HR");
      query = `SELECT * FROM klines_1h WHERE  bucket >= $1 AND bucket <= $2 AND currency_code = $3 
  `;
      break;
    case "1w":
      query = `SELECT * FROM klines_1w WHERE bucket >= $1 AND bucket <= $2 AND currency_code = $3 
  `;
      break;
    default:
      return res.status(400).send("Invalid interval");
  }

  try {
    const start = new Date(Number(startTime) * 1000);
    const end = new Date(Number(endTime) * 1000);

    const result = await pgClient.query(query, [start, end, symbol]);
    res.json(
      result.rows.map((x) => ({
        close: x.close,
        end: x.bucket,
        high: x.high,
        low: x.low,
        open: x.open,
        quoteVolume: x.quoteVolume,
        start: x.start,
        trades: x.trades,
        volume: x.volume,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});
