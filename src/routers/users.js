const log = console.log
const express = require('express')
const User = require('../models/users.js')
const app = new express.Router()

// Get All Users
app.get('/users', async (req,res) => {
    try{
       const user =  await User.find({})
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Get Users By Id
app.get('/users/:id', async (req,res) => {
    const _id = req.params.id
    //log(_id)

    try{
        const user =  await User.findById(_id)
         res.send(user)
     } catch (e) {
         res.send(e)
     }
})

// Create a New User
app.post('/users', async (req,res) => {

    const user = new User(req.body)
    const token = await user.getAuthToken()
    try{
        await user.save()
        res.send(user,token)
    } catch (e){
        res.status(400).send(e)
    }
    
})

// Update a user
app.patch('/users/:id', async (req,res) => {

    const keys = Object.keys(req.body)
    const allowed = ["name", "age", "email", "password"]
    const keyPresent = keys.every((key) => allowed.includes(key))

    if(!keyPresent){
        return res.status(400).send('Key Not found')
    }
    try{
        const user = await User.findById(req.params.id)

        keys.forEach((key) => {
            user[key] = req.body[key] 
        })

        await user.save()

        if(!user){
            return res.status(400).send('User Not found')
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete a user
app.delete('/users/:id', async (req,res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(400).send('User Not Found')
        }
        res.send(user)
    } catch(e) {
        res.status(400).send(e)
    }
})

// Login User
app.post('/users/login', async (req,res) => {
    //log(req.body.email, req.body.password)
    try{
        const user = await User.findByEmail(req.body.email, req.body.password)
        const token = await user.getAuthToken()
        //log(token)
        res.send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }

})

module.exports = app

