const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a task name must be provided']
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session'
    }
  ]
}, { timestamps: true })

taskSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Task', taskSchema)