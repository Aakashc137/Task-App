const mongoose = require('mongoose')
const log = console.log
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw new Error('Email is Invalid') 
                }
            }
        },
        age: {
            type: Number,
            default: 0,
            validate(value){
                if(value<0){
                    throw new Error('Age cannot be negative')
                }
            }
        },
        password:{
            type: String,
            required: true,
            minlength: 7,
            validate(value){
                if(value.toLowerCase().includes('password')){
                    throw new Error('Password invalid')
                }
            }
        },
        tokens : [{
            token:{
                type : String,
                required : true
            }
        }]
    }
)

userSchema.statics.findByEmail = async (email, password) => {

    const user = await User.findOne({email : email})
    
    if(!user){
        //log('Hello')
        throw new Error('User not found')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        log('Wrong Password')
        throw new Error('Wrong Password')
    }

    //log(user)
    return user
}

userSchema.methods.getAuthToken = async function(_id) {
    const token = jwt.sign({ _id: this._id.toString()},'Aakash')
    log(token)
    this.tokens = this.tokens.concat({token})
    await this.save()

    return token
}

userSchema.pre('save', async function(next) {

    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User