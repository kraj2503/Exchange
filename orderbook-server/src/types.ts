import { z } from "zod";

export const orderBookSchema = z.object({
  baseAsset: z.string(),
  quoteAsset: z.string(),
  price: z.number(),
  quantity: z.number(),
  side: z.enum(["bid", "ask"]),
  type: z.enum(["limit", "market"]),
  kind: z.enum(["ioc"]).optional(),
});
