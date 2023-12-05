
const tasksRouter = require('express').Router()
const Task = require('../models/task')
const jwt = require('jsonwebtoken')
const userExtractor = require('../utils/middleware').userExtractor

tasksRouter.get('/', userExtractor, async (request, response, next) => {
  try {
    const user = request.user
    const tasks = await Task.find({ user: user.id })
    response.json(tasks)
  } catch (error) {
    next(error)
  }
})


tasksRouter.get('/:id', async (request, response, next) => {
  try {
    const task = await Task.findById(request.params.id)

    if (!task) {
      response.status(404).end()
    }

    if (!(request.decodedToken.id && (request.decodedToken.id === task.user.toString()))) {
      return response.status(400).json({ error: 'invalid token' })
    }

    response.json(task)
  } catch (error) {
    next(error)
  }
})

tasksRouter.post('/', userExtractor, async (request, response, next) => {
  const task = new Task(request.body)

  try {
    const user = request.user
    task.user = user.id

    const savedTask = await task.save()
    user.tasks = user.tasks.concat(savedTask._id)
    await user.save()

    response.status(201).json(savedTask)
  } catch (error) {
    next(error)
  }
})

tasksRouter.delete('/:id', userExtractor, async (request, response, next) => {
  try {
    const task = await Task.findById(request.params.id)

    if (!task) {
      return response.status(401).json({ error: 'invalid id' })
    }

    if (!(request.decodedToken.id && (request.decodedToken.id === task.user.toString()))) {
      return response.status(400).json({ error: 'invalid token' })
    }
    await Task.findByIdAndRemove(request.params.id)

    const user = request.user
    user.tasks = user.tasks.filter(task => task != request.params.id)
    await user.save()

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

tasksRouter.put('/:id', userExtractor, async (request, response, next) => {

  const taskBody = request.body

  const task = {
    name: taskBody.name,
    completed: taskBody.completed,
    totalTime: taskBody.totalTime
  }


  try {
    const taskToUpdate = await Task.findById(request.params.id)
    if (!(request.decodedToken.id && (request.decodedToken.id === taskToUpdate.user.toString()))) {
      return response.status(400).json({ error: 'invalid token' })
    }

    const updatedTask = await Task.findByIdAndUpdate(request.params.id, task, { new: true })

    response.status(200).json(updatedTask)
  } catch (error) {
    next(error)
  }
})

tasksRouter.get('/:taskId/sessions', async (request, response, next) => {
  try {
    const id = request.params.taskId
    const task = await Task.findById(id).populate('sessions').exec()

    if (!(request.decodedToken.id && (request.decodedToken.id === task.user.toString()))) {
      return response.status(400).json({ error: 'invalid token' })
    }

    response.json(task.sessions)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

tasksRouter.get('/:taskId/totalTime', async (request, response, next) => {
  try {
    const id = request.params.taskId
    const task = await Task.findById(id).populate('sessions').exec()
    const sessions = task.sessions

    const totalTime = sessions.reduce((total, session) => {
      return total + session.duration
    }, 0)
    response.json(totalTime)
  } catch (error) {
    next(error)
  }
})



module.exports = tasksRouter
