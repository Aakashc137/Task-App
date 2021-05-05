const log = console.log
const express = require('express')
const auth = require('../middleware/auth.js')
const Task = require('../models/tasks.js')
const app = new express.Router()

//  Get all Tasks
app.get('/tasks', auth ,async (req,res) => {
    try{
        const task = await Task.find({owner: req.user._id})
        if(task.length==0){
            return res.status(404).send('Tasks Not found')
        }
        res.status(200).send(task)
    } catch (e) {
        res.send(e)
    }
})

// Get tasks By Id
app.get('/tasks/:id', auth ,async (req,res) => {
    const _id = req.params.id

    try{
        //const task = await Task.findById(_id)
        const task = await Task.findOne({ _id, owner: req.user._id})
        if(!task){
            return res.status(404).send('Task Not found')
        }
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Make a New Task
app.post('/tasks',auth ,async (req,res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try{
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Update task
app.patch('/tasks/:id', auth ,async (req, res) => {
    const _id = req.params.id
    const allowed = ["description","completed"]
    const keys = Object.keys(req.body)
    //log(keys)
    const keyIsValid = keys.every((key) => allowed.includes(key))

    //log(keyIsValid)

    if(!keyIsValid){
        return res.status(400).send('Key not Found')
    }

    try{
        const task = await Task.findOne({ _id , owner: req.user._id})

        keys.forEach((key) => {
            task[key] = req.body[key]
        })

        task.save()
        if(!task){
            return res.status(400).send('Task not found')
        }
        res.send(task)

    } catch(e) {
        res.status(400).send(e)
    }
})

// Delete Task
app.delete('/tasks/:id', auth,async (req,res) => {
    try{
        const _id = req.params.id
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})
        if(!task){
            return res.status(400).send('Task Not Found')
        }
        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

module.exports = app