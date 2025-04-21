import { createClient } from "redis";
import { Engine } from "./trade/engine";


export const redisHost = process.env.REDIS_HOST? {
  url: `redis://${process.env.REDIS_HOST}:6379`,
}:{};
async function main() {

  
  const engine = new Engine();
  const redisClient = createClient(redisHost);
  await redisClient.connect().then(() => {
    console.log("Engine connected to redis client");
  });

  while (true) {
    const response = await redisClient.rPop("messages" as string);

    if (!response) {
    } else {
      console.log("poped ", response);
      engine.process(JSON.parse(response));
    }
  }
}
main();
