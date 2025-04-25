

const express = require("express")
const axios = require("axios")
require('dotenv').config()
const app = express()
const cors = require("cors");

const BASE_URL = process.env.BASE_URL || "https://api.backpack.exchange/api/v1/"
console.log(BASE_URL)
app.use(cors());
app.get('/api/v1/klines', async (req, res) => {
        try {

                const { symbol, interval, startTime, endTime } = req.query
                const result = await axios.get("https://api.backpack.exchange/api/v1/klines?symbol=ETH_USDC&interval=1h&startTime=1744806205&endTime=1745411005")
                        // `${BASE_URL}klines?symbol=ETH_USDC&interval=${interval}&startTime=${startTime}&endTime=${endTime}`);

                res.json(result.data);
        }
        catch(e) {
                console.log(``,e);
                
                res.json({ "Error": "error" });
        }
})

// app.get('/api/v1/markets', async (req, res) => {

//         try {
//                 const { symbol } = req.query
//                 const result = await axios.get(`${BASE_URL}markets`)
//                 res.json(result.data);
//         }
//         catch {
//                 res.json({ "Error": "error" });
//         }
// })

// app.get('/api/v1/depth', async (req, res) => {


//         const { symbol } = req.query
//         const result = await axios.get(`${BASE_URL}depth?symbol=${symbol}`)
//         res.json(result.data);

// })

// app.get('/v1/tickers', async (req, res) => {
//         const result = await axios.get(`${BASE_URL}tickers`)
//         res.json(result.data)
// })
// // app.get('/v1/klines', async (req, res) => {
// //         const { market, interval, startTime, endTime } = req.query
// //         const result = await axios.get(`${BASE_URL}klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`)
// //         res.json(result.data);
// // })



// app.get('/v1/trades', async (req, res) => {


//         const { symbol } = req.query
//         const result = await axios.get(`${BASE_URL}trades?symbol=${symbol}`)
//         res.json(result.data);

// })

app.use((req,res)=>{
  
        console.log("wrong api call", req.originalUrl)
        res.json({})
      })

app.listen(3000)