const serverless = require('serverless-http');
const express = require("express");
const cors = require('cors');
require('isomorphic-fetch');

const app = express();
app.use(cors());

app.get('/nftCollectionSales', (req, res) => {
  fetch('https://api.getgems.io/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `{
      nftCollectionSales(
        first: 5000,
        collectionAddress: "EQBPa7td5VDwGltzeSzsp32MkzqzlqHjAOsKtaX0mkMJhq_B",
      ) {
        name
        address
        price
        rarityRank
      }
    }
  ` })
  }).then((response) => {
    if (response.status >= 400) {
      throw new Error("Bad response from server");
    }
    return response.json();
  }).then((collections) => {
    if (collections?.data?.nftCollectionSales) {
      res.json({
        success: true,
        results: collections.data.nftCollectionSales
      });
    } else {
      res.json({
        success: false,
      });
    }
  });
});

app.listen(3000, () => {
  console.log(`Gateway listening on port 3000`);
});
// module.exports.handler = serverless(app);
