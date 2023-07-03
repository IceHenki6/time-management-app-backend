const tasksRouter = require('express').Router()
const Task = require('../models/task')
const jwt = require('jsonwebtoken')
const userExtractor = require('../utils/middleware').userExtractor

tasksRouter.get('/', userExtractor, async (request, response, next) => {
  if(!request.token){
    return response.status(401).json({error: 'no token provided'})
  }

  try{
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id){
      return response.status(400).json({error: 'invalid token'})
    }

    const user = request.user
    const tasks = await Task.find({user: user.id})
    response.json(tasks)
  }catch(error){
    next(error)
  }
})

tasksRouter.get('/:id', async (request, response, next) => {
  if(!request.token){
    return response.status(401).json({error: 'no token provided'})
  }
  try{
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const task = await Task.findById(request.params.id)

    if(!task){
      response.status(404).end()
    }

    if(!(decodedToken.id && (decodedToken.id === task.user.toString()))){
      return response.status(400).json({error: 'invalid token'})
    }

    response.json(task)
  }catch(error){
    next(error)
  }
})

tasksRouter.post('/', userExtractor, async(request, response, next) => {
  const task = new Task(request.body)

  if(!request.token){
    return response.status(401).json({error: 'no token provided'})
  }

  try{
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id){
      return response.status(400).json({error: 'invalid token'})
    }

    const user = request.user
    task.user = user.id

    const savedTask = await task.save()
    user.tasks = user.tasks.concat(savedTask._id)
    await user.save()

    response.status(201).json(savedTask)
  }catch(error){
    next(error)
  }
})

tasksRouter.delete('/:id', userExtractor, async(request, response, next) => {
  if(!request.token){
    return response.status(401).json({error: 'no token provided'})
  }
  try{
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const task = await Task.findById(request.params.id)

    if(!task){
      return response.status(401).json({ error: 'invalid id' })
    }

    if(!(decodedToken.id && (decodedToken.id === task.user.toString()))){
      return response.status(400).json({error: 'invalid token'})
    }
    await Task.findByIdAndRemove(request.params.id)

    const user = request.user
    user.tasks = user.tasks.filter(task => task != request.params.id)
    await user.save()

    response.status(204).end()
  }catch(error){
    next(error)
  }
})

tasksRouter.put('/:id', userExtractor, async(request, response, next) => {
  const taskBody = request.body

  const task = {
    name: taskBody.name,
    duration: taskBody.duration
  }

  if(!task.name || !task.duration){
    return response.status(401).json({ error:'name or task duration missing from the request' })
  }
  try{
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    const taskToUpdate = await Task.findById(request.params.id)
    if(!(decodedToken.id && (decodedToken.id === taskToUpdate.user.toString()))){
      return response.status(400).json({error: 'invalid token'})
    }

    const updatedTask = await Task.findByIdAndUpdate(request.params.id, task, { new: true })
    
    response.status(200).json(updatedTask)
  }catch(error){
    next(error)
  }
})



module.exports = tasksRouter