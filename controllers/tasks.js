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



module.exports = tasksRouter