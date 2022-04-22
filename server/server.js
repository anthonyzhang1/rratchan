const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config({ path: './config.env' });
const port = process.env.EXPRESS_PORT;

app.use(cors());
app.use(express.json());

app.use('/api/boards', require('./routes/boards'));
app.use('/api/users', require('./routes/users'));

app.listen(port, () => {
  console.log(`Express server listening on port ${port}.`);
});

module.exports = app;