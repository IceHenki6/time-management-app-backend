const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const config = require('./utils/config')
const tasksRouter = require('./controllers/tasks')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const sessionsRouter = require('./controllers/sessions')
const cookieParser = require('cookie-parser')
const middleware = require('./utils/middleware')
const refreshTokenRouter = require('./controllers/refreshToken')

mongoose.connect(config.MONGODB_URI)

app.use(cors({origin: 'http://localhost:3000', credentials:true}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/login', loginRouter)
app.use('/api/refresh-token', refreshTokenRouter)
app.use(middleware.verifyToken)

app.use('/api/tasks', tasksRouter)
app.use('/api/users', usersRouter)
app.use('/api/sessions', sessionsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
