import express from 'express'
import logger from 'morgan'
import dotenv from 'dotenv'
import { createClient } from '@libsql/client'

import { Server } from 'socket.io'
import { createServer } from 'http'

dotenv.config()
const port = process.env.PORT ?? 3000

const app = express ()
const server = createServer(app)
const io = new Server(server, {
    connectionStateRecovery: {
        maxDisconnectionDuration: {}
    }
})

const db = createClient({
    url: "libsql://genuine-savant-delmo1501.turso.io",
    authToken: process.env.DB_TOKEN,
})

await db.execute(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL
    )
`)

io.on('connection', async (socket) => {
    console.log('user connected!')

    socket.on('disconnect', () => {
        console.log('user disconnected!')
    })

    socket.on('chat message', async (msg) => {
        let result
        try {
            result = await db.execute({
                sql: 'INSERT INTO messages (content) VALUES (:msg)',
                // why we are not using `${msg}`? Like this we prevent random injections from the user
                args: { msg }
            })
        } catch (e) {
          console.error(e)
          return   
        }
        io.emit('chat message', msg, result.lastInsertRowid.toString())
    })

    if (!socket.recovered) {
        try {
            const results = await db.execute({
                sql: 'SELECT id, content FROM messages WHERE id > ?',
                args: [socket.handshake.auth.serverOffset ?? 0]
            })

            results.rows.forEach(row => {
                socket.emit('chat message', row.content, row.id.toString())
            })
        } catch (error) {
            console.error(error)
        }
    }
})

app.use(logger('dev'))

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(port, () => {
    console.log('server running')
})