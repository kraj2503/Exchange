import { Router } from "express";
import { RedisManager } from "../redisManager";
import { ON_RAMP } from "../types";

export const UserRouter = Router();

UserRouter.post("/onRamp", async (req, res) => {
  const { userId, amount } = req.body;

  const response = await RedisManager.getInstance().sendAndAwait({
    type: ON_RAMP,
    data: {
      userId: userId as string,
      amount: amount as string,
    },
  });

  res.json(response.payload);
});
