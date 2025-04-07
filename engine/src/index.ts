import { createClient } from "redis";
import { Engine } from "./trade/engine";
async function main() {
  const engine = new Engine(); 
  const redisClient = createClient();
  await redisClient.connect().then(() => {
    console.log("main Engine connected to redis client");
  });

  while (true) {
    const response = await redisClient.rPop("messages" as string);

    if (!response) {
    } else {
    engine.process(JSON.parse(response));
      console.log("poped from redis client: ",response);
    }
  }
}
main()