const sessionsRouter = require('express').Router()
const Session = require('../models/session')
const Task = require('../models/task')
const jwt = require('jsonwebtoken')

sessionsRouter.post('/', async (req, res, next) => {
  if(!req.token){
    return res.status(401).json({ error: 'no token provided'} )
  }

  try{
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if(!decodedToken.id){
      return res.status(400).json({ error: 'invalid token'} )
    }

    const { taskId, duration } = req.body

    if(!taskId) {
      return res.status(401).json({ error: 'a task id must be provided' })
    }

    const session = new Session({
      duration: duration
    })

    const task = await Task.findById(taskId)

    const savedSession = await session.save()
    task.sessions = task.sessions.concat(savedSession._id)
    await task.save()

    res.status(201).json(savedSession)
  }catch(error){
    console.log(error)
    next(error)
  }
})


module.exports = sessionsRouter