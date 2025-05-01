import { Router } from "express";
import { Client } from "pg";
import { login } from "../login";  

const client = new Client(login);
client.connect();

const tickerRouter = Router();

tickerRouter.get("/", async (req: any, res: any) => {
  try {
  
    const lastTradeQuery = `
      SELECT price, volume, time
      FROM "ETH_INR"
      ORDER BY time DESC
      LIMIT 1;
    `;
    const lastTradeResult = await client.query(lastTradeQuery);
    const lastTrade = lastTradeResult.rows[0];

    if (!lastTrade) {
      return res.status(404).json({ message: "No trades found." });
    }

    const currentPrice = lastTrade.price;
    const currentVolume = lastTrade.volume;

    // 24-Hour data
    const startOfDay = new Date(new Date().getTime() - 1000 * 60 * 60 * 24); // 24 hours ago
    const startOfDayUnix = Math.floor(startOfDay.getTime() / 1000);

   
    const dailyDataQuery = `
      SELECT
        MAX(price) AS high,
        MIN(price) AS low,
        SUM(volume) AS volume
      FROM "ETH_INR"
      WHERE time >= to_timestamp($1)
    `;
    const dailyDataResult = await client.query(dailyDataQuery, [startOfDayUnix]);
    const dailyData = dailyDataResult.rows[0];

    // 24H Change (based on price 24 hours ago)
    const price24HoursAgoQuery = `
      SELECT price
      FROM "ETH_INR"
      WHERE time >= to_timestamp($1)
      ORDER BY time ASC
      LIMIT 1;
    `;
    const price24HoursAgoResult = await client.query(price24HoursAgoQuery, [startOfDayUnix]);
    const price24HoursAgo = price24HoursAgoResult.rows[0]?.price;

    if (!price24HoursAgo) {
      return res.status(404).json({ message: "No price data available for 24H change." });
    }

    const change24H = price24HoursAgo ? currentPrice - price24HoursAgo : 0;
    const change24HPercentage = price24HoursAgo ? (change24H / price24HoursAgo) * 100 : 0;

   
    const response = {
      currentPrice:  2039.50,
      currentVolume: 7865.60,
      change24H: {
        value: change24H.toFixed(3) || "5.342",
        percentage: change24HPercentage.toFixed(2) || "2.455%",
      },
      high24H: dailyData.high || 2798,
      low24H: dailyData.low || 1500,
      volume24H: dailyData.volume || 473634.870,
    };

    // Send the response back
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch ticker data.", error: err });
  }
});

export { tickerRouter };
