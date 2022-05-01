const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });
const port = process.env.EXPRESS_PORT;

app.use(cors());
app.use(express.json());

// allow the frontend to display these files
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/api/boards', require('./routes/boards'));
app.use('/api/replies', require('./routes/replies'));
app.use('/api/threads', require('./routes/threads'));
app.use('/api/users', require('./routes/users'));

app.listen(port, () => { console.log(`Express server listening on port ${port}.`); });

module.exports = app;