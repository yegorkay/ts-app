const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const rushingJSON = fs.readFileSync('rushing.json');
// return alphabetically sorted JSON
const parsedData = JSON.parse(rushingJSON).sort((a, b) => {
  if (a.Player < b.Player) {
    return -1;
  }
  if (a.Player > b.Player) {
    return 1;
  }
  return 0;
});

// API calls
app.get('/api/players', (req, res) => {

  const { query } = req.query;

  let data = [];

  if (query !== undefined) {
    const filteredData = parsedData.filter((player) => {
      return player.Player.toLowerCase().includes(query.toLowerCase());
    });
    data.push(...filteredData);
  } else {
    data.push(...parsedData);
  }

  res.send({ data });

});

app.listen((port), () => console.log(`Listening on port ${port}`));

// last resorts
process.on("uncaughtException", (err) => {
  console.log(`Caught exception: ${err}`);
  process.exit(1);
});
process.on("unhandledRejection", (reason, p) => {
  console.log(`Unhandled Rejection at: Promise, ${p}, reason: ${reason}`);
  process.exit(1);
});
