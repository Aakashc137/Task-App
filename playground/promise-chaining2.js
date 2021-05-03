var database = require('../src/db/mongoose.js')
const Task = require('../src/models/tasks.js')
const log = console.log

// Task.findByIdAndRemove(("608d384f6a354f8f685c1dff")).then((task) => {
//     log(task)
//     return Task.countDocuments({completed:false})
// }).then((count) => {
//     log(count)
// }).catch((e) => {
//     log(e)
// })

const deleteTaskAndCount = async (id) => {
    const records = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed:false})
    return count
}

deleteTaskAndCount("608cff8e2b6ac18b625555c3").then((count) => {
    log(count)
}).catch((e) => {
    log(e)
})