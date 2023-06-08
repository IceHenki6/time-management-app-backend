const config = require('./utils/config')
const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
  name: String,
  duration: {type: Number, min: 1, max: 120 },
  date: { type: Date, default: Date.now }
})

const Task = mongoose.model('Task', taskSchema)

const task = new Task({
  name: 'First task',
  duration: 5,
  date: Date.now()
})

task.save().then(result => {
  console.log('task saved')
  mongoose.connection.close()
})