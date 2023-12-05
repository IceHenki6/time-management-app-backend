const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const userExtractor = require('../utils/middleware').userExtractor
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Task = require('../models/task')

usersRouter.post('/', async (req, res, next) => {
  const { email, username, password } = req.body

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'a password is required and it must be longer than 8 characters long' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    email,
    username,
    passwordHash
  })

  try {
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }

})

usersRouter.get('/', async (req, res, next) => {
  try {
    const userId = decodedToken.id
    const user = await User.findById(userId).populate('tasks', { name: 1, duration: 1, date: 1 })
    res.json(user)
  } catch (error) {
    next(error)
  }
})

usersRouter.patch('/updateUsername', userExtractor, async (req, res, next) => {
  const { username } = req.body

  if (!username) {
    return res.status(401).json({ error: "no username provided" })
  }

  if (!req.token) {
    return response.status(401).json({ error: 'no token provided' })
  }

  try {

    const userId = req.user.id

    const patchedUser = await
      User.findByIdAndUpdate(userId, { $set: { username } }, { new: true })

    const tokenUser = {
      username: patchedUser.username,
      id: patchedUser._id
    }

    const token = jwt.sign(tokenUser, process.env.SECRET, {expiresIn: '1m'})

    res.status(200).send({ token, username: patchedUser.username })
  } catch (error) {
    next(error)
  }
})

usersRouter.patch('/updatePassword', userExtractor, async (req, res, next) => {
  const { password } = req.body

  if (!password) {
    return res.status(401).json({ error: 'no new password provided' })
  }

  if (!req.token) {
    return response.status(401).json({ error: 'no token provided' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  try {
    const decodedToken = jwt.verify(req.token, process.env.SECRET)

    const userId = decodedToken.id

    const patchedUser = await
      User.findByIdAndUpdate(userId, { $set: { passwordHash } }, { new: true })

    const tokenUser = {
      username: patchedUser.username,
      id: patchedUser._id
    }

    const token = jwt.sign(tokenUser, process.env.SECRET, {expiresIn: '1m'})

    res.status(200).send({ token, username: patchedUser.username })
  } catch (error) {
    next(error)
  }

})

usersRouter.get('/sessions', userExtractor, async (req, res, next) => {
  try {
    const user = req.user

    const userWithSessions = await User.findById(user.id).populate('sessions').exec()

    const allSessions = userWithSessions.sessions

    res.json(allSessions)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

module.exports = usersRouter