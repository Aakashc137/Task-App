const express = require('express')
require('./db/mongoose.js')
const User = require('./models/users.js')
const Task = require('./models/tasks.js')
const userRouter = require('./routers/users.js')
const taskRouter = require('./routers/tasks.js')
const log = console.log

const app = express()
const port = process.env.PORT || 3000


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)





app.listen(port, () => {
    log('Server is up and running on port: ' + port)
})