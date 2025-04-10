import axios from "axios";



const MARKET = "ETH_INR";
const USER_ID = "1";
const BASE_URL = "http://localhost:3000";

async function main(){
    const price = 1000  + Math.random()*10;
    const openOrders:any = await axios.get(`${BASE_URL}/api/v1/order/open?userId=${USER_ID}&market=${MARKET}`);

    const totalBids = openOrders.data.filter((o:any)=> o.side ==="buy").length
    const totalAsks = openOrders.data.filter((o:any)=> o.side ==="sell").length


    const cancelledBids = await cancelBidsMoreThan(openOrders.data,price)
    const cancelledAsks= await cancelBidsLessThan(openOrders.data,price)

console.log(openOrders.data)

}

main()