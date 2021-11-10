const axios = require('axios');
const querystring = require('querystring');

const crypto = require('crypto');
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const apiUrl = process.env.API_URL;

async function newOrder(symbol, quantity, price, side, type) {
  const data = { symbol, side, type, quantity};

  if(price) data.price = price;
  if(type === 'LIMIT') data.timeInforce = 'GTC';

  const timestamp = Date.now();
  const recvWindow = 60000;

  const signature = crypto.createHmac('sha256', apiSecret)
    .update(`${querystring.stringify({ ...data, timestamp, recvWindow })}`)
    .digest('hex');

    const newData = { ...data, timestamp, recvWindow, signature };
    //URLSearchParams
    const qs = `?${querystring.stringify(newData)}`;

    try{
      const result = await axios({
        method: 'POST',
        url: `${apiUrl}/v3/order${qs}`,
        headers: { 'X-MBX-APIKEY': apiKey }
      })
      return result.data
    }
    catch(err){
      console.error(err);
    }
}

module.exports = {
  newOrder
}