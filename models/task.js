const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a task name must be provided']
  },
  duration: {
    type: Number,
    required: [true, 'a task duration must be provided']
  },
  date: {
    type: Date,
    default: Date.now,
    required: [true, 'a date must be provided']
  }
})

taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject._v
  }
})

module.exports = mongoose.model('Task', taskSchema)