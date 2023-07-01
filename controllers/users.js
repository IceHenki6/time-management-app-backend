const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (req, res, next) => {
  const { username, name, password } = req.body

  if(!password || password.length < 8){
    return res.status(400).json({error: 'a password is required and it must be longer than 8 characters long'})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username, 
    name,
    passwordHash
  })

  try{
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  }catch(error){
    next(error)
  }

})

usersRouter.get('/', async (req,res, next) => {
  try{
    const users = await User.find({}).populate('tasks', { name: 1, duration: 1, date: 1 })
    res.json(users)
  }catch(error){
    next(error)
  }
})

module.exports = usersRouter