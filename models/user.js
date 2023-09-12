const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  email:{
    type: String,
    required: [true, 'an email address is required'],
    unique: true,
    maxlength: 50
  },
  username: {
    type: String,
    required: [true, 'a username is required'],
    unique: true,
    maxlength: 15
  },
  passwordHash: String,
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
    }
  ]
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: ((document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  })
})

const User = mongoose.model('User', userSchema)

module.exports = User
