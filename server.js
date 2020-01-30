const express = require('express');
const router = require('express').Router();

const db = require('./data/dbConfig.js');

const server = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./openapi.json');

server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
server.use(express.json());

server.get('/', (_req, res) => {
  res.send(`<h1>Node API Challenge</h1>`)
})

module.exports = server;