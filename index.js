require('dotenv-safe').config();

const webSocket = require('ws');
const ws = new webSocket('wss://stream.binance.com:9443/ws/!bookTicker');
const api = require('./api');

const SYMBOL = 'BTCUSDT'
let estouComprado = false;
ws.onmessage = async (event) => {
  const obj = JSON.parse(event.data);
  if(obj.s === SYMBOL) {
    if (!estouComprado) {
      estouComprado = true;
      const buyOrder = await api.newOrder(SYMBOL, 0.001, 0, 'BUY', 'MARKET');
      console.log(buyOrder);

    }
    if(parseFloat(obj.b) > 68750) {
      const buyPrice = parseFloat(buyOrder.fills[0].price);
      const sellOrder = await api.newOrder(SYMBOL, 0.001, buyPrice * 1.5, 'SELL', 'LIMIT' );
      console.log(sellOrder);
      process.exit(1);

    }
    console.log( 'nao vendeu:' + obj.b);
  }
}