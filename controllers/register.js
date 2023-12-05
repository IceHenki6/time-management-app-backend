const registerRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')


registerRouter.post('/', async (req, res, next) => {
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


module.exports = registerRouter