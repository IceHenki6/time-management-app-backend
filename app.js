const express = require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('./utils/config')
const tasksRouter = require('./controllers/tasks')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')


mongoose.connect(config.MONGODB_URI)

app.use(express.json())

app.use(middleware.tokenExtractor)
app.use('/api/tasks', tasksRouter)
app.use('/api/users', usersRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app