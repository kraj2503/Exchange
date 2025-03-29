

const express = require("express")
const axios = require("axios")
require('dotenv').config()
const app = express()
const cors = require("cors");

const BASE_URL = process.env.BASE_URL
console.log(BASE_URL)
app.use(cors());
app.get('/v1/klines', async (req, res) => {
        try {

                const { symbol, interval, startTime, endTime } = req.query
                const result = await axios.get(`${BASE_URL}klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`);

                res.json(result.data);
        }
        catch {
                res.json({ "Error": "error" });
        }
})

app.get('/v1/markets', async (req, res) => {

        try {
                const { symbol } = req.query
                const result = await axios.get(`${BASE_URL}markets`)
                res.json(result.data);
        }
        catch {
                res.json({ "Error": "error" });
        }
})

app.get('/v1/depth', async (req, res) => {


        const { symbol } = req.query
        const result = await axios.get(`${BASE_URL}depth?symbol=${symbol}`)
        res.json(result.data);

})

app.get('/v1/tickers', async (req, res) => {
        const result = await axios.get(`${BASE_URL}tickers`)
        res.json(result.data)
})
// app.get('/v1/klines', async (req, res) => {
//         const { market, interval, startTime, endTime } = req.query
//         const result = await axios.get(`${BASE_URL}klines?symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`)
//         res.json(result.data);
// })



app.get('/v1/trades', async (req, res) => {


        const { symbol } = req.query
        const result = await axios.get(`${BASE_URL}trades?symbol=${symbol}`)
        res.json(result.data);

})


app.use(function (err, req, res, next) {
        res.status(500);
        res.send("Oops, something went wrong.")
});
app.listen(3005)