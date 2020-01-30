import express, { json } from 'express'
import { serve, setup } from 'swagger-ui-express'

import swaggerDocument from './openapi.json'

import db from './data/dbConfig'

const server = express()
server.use('/api-docs', serve, setup(swaggerDocument))
server.use(json())

server.get('/', (_req, res) => res.send(`<h1>Node API Challenge</h1>`))

export default server
