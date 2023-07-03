const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if(error.name === 'CastError') {
    return res.status(400).send({error: 'invalid id'})
  }else if(error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message })
	}else if(error.name === 'JsonWebTokenError'){
		return res.status(400).json({ error: error.message })
	}

  next(error)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if(authorization && authorization.startsWith('Bearer ')){
    req.token = authorization.replace('Bearer ', '')
  }else{
    req.token = null
  }
  next()
}

const userExtractor = async (req, res, next) => {
  try{
    if(req.token){
      const decodedToken = jwt.verify(req.token, process.env.SECRET)
      const user = await User.findById(decodedToken.id)
      user ? req.user = user : req.user = null
    }
    next()
  }catch(error){
    next(error)
  }
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}
