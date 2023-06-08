const express = require('express')
const app = express()
const mongoose = require('mongoose')
const config = require('./utils/config')
const tasksRouter = require('./controllers/tasks')


mongoose.connect(config.MONGODB_URI)

app.use(express.json())

app.use('/api/tasks', tasksRouter)

module.exports = app