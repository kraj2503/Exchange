import { createClient } from "redis";

async function main() {
  const redisClient = createClient();
  await redisClient.connect().then(() => {
    console.log("main Engine connected to redis client");
  });

  while (true) {
    const response = await redisClient.rPop("messages" as string);
    if (!response) {
    } else {

      console.log("poped from redis client: ",response);
    }
  }
}
main()