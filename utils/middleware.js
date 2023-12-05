const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'invalid id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

const verifyToken = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '')
    jwt.verify(
      token,
      process.env.TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.status(403).json({ message: 'forbidden' })
        req.decodedToken = decoded
        next()
      }
    )
  } else {
    return res.status(401).json({ message: 'unauthorized' })
  }
  // next()
}

const userExtractor = async (req, res, next) => {
  try {
    const user = await User.findById(req.decodedToken.id)
    user ? req.user = user : req.user = null
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  verifyToken,
  userExtractor
}
