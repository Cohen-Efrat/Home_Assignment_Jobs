const express = require('express')
const jobModel = require('../models/job')
const auth = require('../middleware/auth')
const router = new express.Router()
const cronManager = require('../utils/cronManager')

router.get('/jobs',auth, async (req, res) => {
    try {
        await req.user.populate('jobs').execPopulate()
        res.send(req.user.jobs)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})

router.post('/jobs',auth, async (req, res) => {
    const {subject, frequency} =req.body
    const job = new jobModel(
    {
        subject,
        frequency,
        owner: req.user._id
    })
    try {
        await job.save()
        res.status(201).send(job)
    } catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

router.delete('/jobs/:id', auth, async (req, res) => {
    try {
        const job = await jobModel.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        cronManager.removeJob(job.subject,req.user._id)
        if (!job) {
            res.status(404).send()
        }
        res.send(job)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})


module.exports = router