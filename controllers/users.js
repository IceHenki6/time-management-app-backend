const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const userExtractor = require('../utils/middleware').userExtractor
const jwt = require('jsonwebtoken')
const User = require('../models/user')

usersRouter.post('/', async (req, res, next) => {
  const {email, username, password } = req.body

  if(!password || password.length < 8){
    return res.status(400).json({error: 'a password is required and it must be longer than 8 characters long'})
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    email,
    username, 
    passwordHash
  })

  try{
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  }catch(error){
    next(error)
  }

})

usersRouter.get('/', async (req, res, next) => {
  if(!req.token){
    return res.status(401).json({error: 'no token provided'})
  }

  try{
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    const userId = decodedToken.id
    const user = await User.findById(userId).populate('tasks', { name: 1, duration: 1, date: 1 })
    res.json(user)
  }catch(error){
    next(error)
  }
})

usersRouter.patch('/', userExtractor, async (req, res, next) => {
  const { username } = req.body

  if(!username){
    return res.status(401).json({ error: "no username provided" })
  }

  if(!req.token){
    return response.status(401).json({error: 'no token provided'})
  }

  try{
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    
    const userId = decodedToken.id

    const patchedUser = await 
      User.findByIdAndUpdate(userId, { $set: { username } }, { new: true })
    
    const tokenUser = {
      username: patchedUser.username,
      id: patchedUser._id
    }

    const token = jwt.sign(tokenUser, process.env.SECRET)

    res.status(200).send({token, username: patchedUser.username, name: patchedUser.name})
  }catch(error){
    next(error)
  }
})

usersRouter.get('/sessions', userExtractor, async(req,res,next) => {
  if(!req.token){
    return response.status(401).json({error: 'no token provided'})
  }
  try{
    const user = await User.findById(req.user.id).populate('tasks').exec()

    const allSessions = []

    for (const task of user.tasks){
      const populatedTask = await task.populate('sessions')
      allSessions.push(...populatedTask.sessions)
    }

    res.json(allSessions)
  }catch(error){
    console.log(error)
    next(error)
  }
})

module.exports = usersRouter