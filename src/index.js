const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000


app.use(express.json())
app.use(userRouter, taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

// const Task = require('./models/task')
// const User = require('./models/user')

// const main = async () => {
//     // const task = await Task.findById('5dd13646f8093b05043ecb26')
//     // await task.populate('owner').execPopulate() 
//     // console.log(task.owner.name)

//     const user = await User.findById('5dd13a520629ee1ab0150a76')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }

// main()