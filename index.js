const https = require('https');
const express = require('express')
const app = express()
const port = 3000

const url = 'https://api.kraken.com/0/public/Ticker?pair=BTCEUR';

https.get(url, res => {
  res.setEncoding('utf8');
  let body = '';
  res.on('data', data => {
    body += data;
  });
  res.on('end', () => {
    body = JSON.parse(body);
    const price = body.result.XXBTZEUR.c[0];
    app.get('/metrics', (req, res) => {
        res.send(`# HELP bitcoin_price_total Bitcoin price\n# TYPE bitcoin_price_total gauge\nbitcoin_price_total ${price}`);
    });
  });
});

app.listen(port, () => console.log(`Price exporter app listening on port ${port}`))
