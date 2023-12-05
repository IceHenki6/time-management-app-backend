const sessionsRouter = require('express').Router()
const Session = require('../models/session')
const Task = require('../models/task')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

sessionsRouter.post('/', userExtractor, async (req, res, next) => {
  try{

    const { taskId, duration } = req.body

    const user = req.user

    if(taskId){
      const session = new Session({
        duration: duration
      })
      
      session.user = user.id
      const task = await Task.findById(taskId)
  
      const savedSession = await session.save()
      task.sessions = task.sessions.concat(savedSession._id)
      await task.save()

      user.sessions = user.sessions.concat(savedSession._id)
      await user.save()

      res.status(201).json(savedSession)
    }else{
      const session = new Session({
        duration: duration
      })

      session.user = user.id

      const savedSession = await session.save()
      user.sessions = user.sessions.concat(savedSession._id)
      await user.save()

      res.status(201).json(savedSession)
    }
    
  }catch(error){
    console.log(error)
    next(error)
  }
})


module.exports = sessionsRouter