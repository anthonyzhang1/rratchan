const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: './config.env' });
const port = process.env.EXPRESS_PORT;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Express server test output.');
});

app.listen(port, () => {
  console.log(`Express server listening on port ${port}.`);
});