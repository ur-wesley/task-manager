const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
    //  const task = new Task(req.body)
    const task = new Task({
        ...req.body, // copy all over from req.body to this object
        owner: req.user._id // adding an owner
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/tasks', auth, async (req, res) => {
    const owner = req.user._id
    try {
        const tasks = await Task.find({ owner })
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params._id
    const owner = req.user._id
    try {
        const task = await Task.findByeOne({ _id, owner })
        if (!task) { return res.status(404).send() }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    const _id = req.params._id
    const owner = req.user._id

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid update!' })
    }

    try {
        const task = await Task.findById({ _id, owner })
        
        if (!task) { return res.status(404).send() }
        
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (e) {
        res.status(400).send()
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    const owner = req.user._id
    try {
        const task = await Task.findOneAndDelete({_id, owner})
        if (!task) { return res.status(404).send() }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router