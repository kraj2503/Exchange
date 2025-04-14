import { createLocalRequestContext } from "next/dist/server/lib/builtin-request-context";
import { Client } from "pg";
import { createClient } from "redis";
import { Dbmessage } from "./types";

const pgClient = new Client({
  user: "exchange",
  host: "localhost",
  database: "my_database",
  password: "toughpassword",
  port: 5432,
});

pgClient.connect();
let stockName = "ETH_INR";
async function main() {
  const redisClient = createClient();
  await redisClient.connect();

  console.log(" DB connected to redis");

  while (true) {
    const response = await redisClient.rPop("db_processor" as string);
    if (!response) {
    } else {
      const data: Dbmessage = JSON.parse(response);
      if (data.type === "TRADE_ADDED") {
        console.log("Adding Trade");
        console.log(data);
        const price = data.data.price;
        const timestamp = new Date(data.data.timestamp);
        const query = `INSERT INTO  ${stockName} (time,price) VALUES ($1,
                $2)`;
        const values = [timestamp, price];
        await pgClient.query(query, values);
      }
    }
  }
}

main()
