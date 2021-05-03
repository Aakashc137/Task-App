const log = console.log
const express = require('express')
const Task = require('../models/tasks.js')
const app = new express.Router()

//  Get all Tasks
app.get('/tasks', async (req,res) => {
    try{
        const task = await Task.find({})
        res.send(task)
    } catch (e) {
        res.send(e)
    }
})

// Get tasks By Id
app.get('/tasks/:id',  async (req,res) => {
    const _id = req.params.id
    log(_id)

    try{
        const task = await Task.findById(_id)
        if(!task){
            return res.status(401).send('Task Not found')
        }
        res.send(task)
    } catch (e) {
        res.send(e)
    }
})

// Make a New Task
app.post('/tasks', async (req,res) => {

    const task = new Task(req.body)

    try{
        await task.save()
        res.send(task)
    } catch (e) {
        res.send(e)
    }
})

// Update task

app.patch('/tasks/:id', async (req, res) => {
    const allowed = ["description","completed"]
    const keys = Object.keys(req.body)
    log(keys)
    const keyIsValid = keys.every((key) => allowed.includes(key))

    log(keyIsValid)
    if(!keyIsValid){
        return res.status(400).send('Key not Found')
    }

    try{
        const task = await Task.findById(req.params.id)

        keys.forEach((key) => {
            task[key] = req.body[key]
        })

        task.save()
        if(!task){
            return res.status(400).send('Task not found')
        }
        res.send(task)

    } catch(e) {
        res.send(e)
    }
})

// Delete Task
app.delete('/tasks/:id', async (req,res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            return res.status(400).send('Task Not Found')
        }
        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

module.exports = app