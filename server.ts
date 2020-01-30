import express, {
  json,
  Request,
  Response,
  NextFunction,
  ErrorRequestHandler,
} from 'express'
import morgan from 'morgan'
import { serve, setup } from 'swagger-ui-express'
// import accountsRouter from './resources/accounts/accounts.router'

import swaggerDocument from './openapi.json'

const server = express()

const jsonSyntaxErrorHandler = (
  error: ErrorRequestHandler,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof SyntaxError) {
    res.status(400).json({ error: 'JSON syntax error' })
  } else {
    next()
  }
}

server.use('/docs', serve, setup(swaggerDocument))
server.use(morgan('dev'))
server.use(json())
server.use(jsonSyntaxErrorHandler)

// server.use('/api/projects', accountsRouter)

server.get('/', (_req, res) => res.send(`<h1>Node API Challenge</h1>`))

export default server
