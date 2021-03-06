const log = console.log
const express = require('express')
const multer = require('multer')
const User = require('../models/users.js')
const auth = require('../middleware/auth.js')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancellationEmail } = require('../email/account.js')
const app = new express.Router()

// Read Profile
app.get('/users/me',auth,async (req,res) => {
    if(!req.user){
        return res.status(400).send('User Not authenticated')
    }
    res.send(req.user)
})

// Sign Up
app.post('/users', async (req,res) => {

    const user = new User(req.body)
    const token = await user.getAuthToken()
    try{
        await user.save()
        res.send({user, token})
    } catch (e){
        res.status(400).send(e)
    }

    sendWelcomeEmail(user.email, user.name)
    
})

// Logout of a single device
app.post('/users/logout', auth, async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()

        res.send()
    } catch(e){
        res.status(500).send(e)
    }
})

// Logout of all Devices
app.post('/users/logoutAll', auth, async (req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send('Logged out of all Devices')
    } catch (e){
        res.status(500).send('Could not Authenticate')
    }
})

// Update a user
app.patch('/users/me', auth, async (req,res) => {

    const keys = Object.keys(req.body)
    const allowed = ["name", "age", "email", "password"]
    const keyPresent = keys.every((key) => allowed.includes(key))

    if(!keyPresent){
        return res.status(400).send('Key Not found')
    }
    try{
        //const user = await User.findById(req.params.id)

        keys.forEach((key) => {
            req.user[key] = req.body[key] 
        })
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// Delete a user
app.delete('/users/me', auth ,async (req,res) => {
    try{
        // const user = await User.findByIdAndDelete(req.params.id)
        // if(!user){
        //     return res.status(400).send('User Not Found')
        // }

        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
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

const upload = multer({
    limits : {
        fileSize: 1000000
    },
    fileFilter(req,file,cb){

        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('Extension should be PNG or JPG'))
        } 
        cb(undefined, true)  
    }
})

app.post('/users/me/avatar', auth ,upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width : 250, height : 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

app.delete('/users/me/avatar', auth, async (req, res) => {
    try{
        req.user.avatar = undefined
        await req.user.save()
        res.status(200).send()
    } catch (e) {
        res.status(400).send("There was a problem deleting the avatar")
    }
    
})

app.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        res.status(400).send("Error")
    }
    
})


module.exports = app

