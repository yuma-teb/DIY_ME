// server.js
const app = require('./app');
const db = require('./src/config/db');
require('dotenv').config();

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
