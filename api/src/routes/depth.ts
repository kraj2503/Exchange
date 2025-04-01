import { Router } from "express";
import { RedisManager } from "../redisManager";
import { GET_DEPTH } from "../types";

export const depthRouter = Router();

depthRouter.get("/", async (req, res) => {
  const { symbol } = req.query;
  console.log(symbol)

  const response = await RedisManager.getInstance().sendAndAwait({
    type: GET_DEPTH,
    data: {
      market: symbol as string,
    },
  });
  console.log("Got response")
  res.json(response);
});
