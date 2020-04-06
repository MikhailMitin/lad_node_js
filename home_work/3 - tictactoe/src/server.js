/* eslint-disable linebreak-style */
const express = require('express');
const cors = require('cors');

const app = express();

const routes = require('./routes');

app.use(express.json());
app.use(cors());
// app.use(authMiddleWare); // не использую тут, передаю нужные в запрос
app.use(routes);

module.exports = app;
