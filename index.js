
import Server from "./server.js"
import config from './config.js'

new Server(process.env.PORT || 8080, process.env.MODO_PERSISTENCIA).start()