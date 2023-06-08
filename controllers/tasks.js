const tasksRouter = require('express').Router()
const Task = require('../models/task')

tasksRouter.get('/', async (request, response) => {
  try{
    const tasks = await Task.find({})
    response.json(tasks)
  }catch(error){
    console.log(error)
  }
})

tasksRouter.get('/:id', async (request, response) => {
  try{
    const task = await Task.findById(request.params.id)
    if(task){
      response.json(task)
    }else{
      response.status(404).end()
    }
  }catch(error){
    console.log(error)
  }
})

tasksRouter.post('/', async(request, response) => {
  const task = new Task(request.body)
  try{
    const savedTask = await task.save()
    response.status(201).json(savedTask)
  }catch(error){
    console.log(error)
  }
})

tasksRouter.delete('/:id', async(request, response) => {
  try{
    const task = await Task.findById(request.params.id)
    if(!task){
      return response.status(400).json({ error: 'invalid id' })
    }
    await Task.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }catch(error){
    console.log(error)
  }
})

tasksRouter.put('/:id', async(request, response) => {
  const taskBody = request.body

  const task = {
    name: taskBody.name,
    duration: taskBody.duration
  }

  if(!task.name || !task.duration){
    return response.status(400).json({ error:'name or task duration missing from the request' })
  }
  try{
    const updatedTask = await Task.findByIdAndUpdate(request.params.id, task, { new: true })
    response.status(200).json(updatedTask)
  }catch(error){
    console.log(error)
  }
})



module.exports = tasksRouter