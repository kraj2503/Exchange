import express from "express";
import cors from "cors";
import { depthRouter } from "./routes/depth";
import { orderRouter } from "./routes/order";
import { UserRouter } from "./routes/userRouter";
import { tickersRouter } from "./routes/tickers";
import { klineRouter } from "./routes/kline";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/depth", depthRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/klines",klineRouter)
app.use("/api/v1/tickers", tickersRouter);

app.use((req,res)=>{
  
  console.log("got a ping")
  res.json({})
})
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
