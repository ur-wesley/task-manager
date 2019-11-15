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

const jwt = require('jsonwebtoken');

const myF = async () => {
    const token = jwt.sign({ _id: 'tset' }, 'ThisIsTheToken', { expiresIn: '7 days' })
    console.log(token)

    const verifiedToken = jwt.verify(token, 'ThisIsTheToken')
    console.log(verifiedToken)

}

// myF()