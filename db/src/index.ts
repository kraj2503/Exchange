import { Client } from "pg";
import { createClient } from "redis";
import { Dbmessage } from "./types";
import { login } from "./login";

const pgClient = new Client(login);

pgClient.connect();
let stockName = "ETH_INR";
async function main() {
  const redisClient = createClient({ url: `redis://${process.env.REDIS_HOST}:6379` });;
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
        const timestamp = new Date(Number(data.data.timestamp));
        console.log(`timestamp`, timestamp, typeof timestamp);

        const query = `INSERT INTO  "${stockName}" (time,price) VALUES ($1,
                $2)`;

        const values = [timestamp, price];
        try {
          await pgClient.query(query, values);
          console.log(`Trade added to db`);
        } catch (e) {
          console.log(`Trade failed to be added to db`, e);
        }
      }
    }
  }
}

main();
