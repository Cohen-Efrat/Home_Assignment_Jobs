const CronJobManager = require('cron-job-manager');
const giphy = require('./giphy')
const job = require('../models/job');

const manager = new CronJobManager();


const createJob = (subject, seconds, jobId,userId, socket) => {
    manager.add(subject, `0/${seconds} * * * * *`, async () => {
        const gifURL = await giphy.getGif(subject);
        await job.findOneAndUpdate({_id: jobId}, {$push: {gifs: gifURL}})
        socket.to(userId).emit('newGif', {url:gifURL,subject});
    });
    manager.start(subject);
}


const removeJob = (key) => {
    if (manager.exists(key)) {
        manager.deleteJob(key)
    }
    manager.listCrons();
}


module.exports = {createJob, removeJob}