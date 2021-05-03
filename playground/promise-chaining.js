require('../src/db/mongoose')
const { findByIdAndUpdate } = require('../src/models/users.js')
const User = require('../src/models/users.js')
const log = console.log

// User.findByIdAndUpdate(("608c00803d89b784a99ff230"), { age:0 }).then((users) => {
//     log(users)
//     return User.countDocuments({ age: 0})
// }).then((count) => {
//     log(count)
// }).catch((e) => {
//     log(e)
// })

const findUpdateAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate((id), {age:age})
    const count = await User.countDocuments({age:age})
    return count
}

findUpdateAndCount("608c00803d89b784a99ff230", 19).then((count) => {
    log(count)
}).catch((e) => {
    log(e)
})