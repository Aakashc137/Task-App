const User = require('../models/users.js')
const jwt = require('jsonwebtoken')
const log = console.log

const auth = async (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        
        const decoded = jwt.verify(token,'Aakash')
        const user = await User.findOne({_id:decoded._id, 'tokens.token':token})
        if(!user){
            throw new Error ('User Not found')
        }

        req.token = token
        req.user = user

        next()
    } catch (e) {
        res.status(400).send(e)
    }
    
}

module.exports = auth