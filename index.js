const https = require('https');
const express = require('express')
const app = express()
const port = 3000
const cacheTTL = 30000 // milliseconds

const url = 'https://api.kraken.com/0/public/Ticker?pair=BTCEUR';

let priceData = {
  price: undefined,
  timestamp: undefined,
};

/**
 * @todo DRY
 */
app.get('/metrics', (req, appRes) => {
  if (priceData.timestamp && priceData.timestamp > Date.now() - cacheTTL) {
    appRes.send(`# HELP bitcoin_price_total Bitcoin price\n# TYPE bitcoin_price_total gauge\nbitcoin_price_total ${priceData.price}`);
    console.log('using cache');
  } else {
    https.get(url, res => {
      res.setEncoding('utf8');
      let body = '';
      res.on('data', data => {
        body += data;
      });
      res.on('end', () => {
        body = JSON.parse(body);
        priceData = {
            price: body.result.XXBTZEUR.c[0],
            timestamp: Date.now()
        }
        appRes.send(`# HELP bitcoin_price_total Bitcoin price\n# TYPE bitcoin_price_total gauge\nbitcoin_price_total ${priceData.price}`);
        console.log(priceData);
      });
    });
  }
});

app.listen(port, () => console.log(`Price exporter app listening on port ${port}`))
