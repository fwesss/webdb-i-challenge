import { log } from 'console'
import server from './server'

const PORT = process.env.PORT || 4000

server.listen(PORT, () => log(`Listening on port ${PORT}...`))
