const CronJobManager = require('cron-job-manager');
const giphy = require('./giphy')
const job = require('../models/job');

const manager = new CronJobManager();

// on create job save the use in array set count to 1
// on the callback incres count in 1
// if count  == 3 (30) retun from array

    // {
    // userId:"1",
    // count: 0,
    // gifs:[],
    // subject:""
    // }

const jobs = []
    
const createJob = (subject, seconds, jobId,userId, socket) => {
    let jobIndex = jobs.findIndex((job)=> job.id === userId && job.subject === subject );
    let jobData = jobs[jobs.length-1];
    if(jobIndex === -1){
        jobs.push({
            id: userId,
            count:0,
            gifs:[],
            subject,
        })
        jobData = jobs[jobs.length-1];
        jobIndex = jobs.length-1;
    }
    manager.add(`${subject}-${userId}`, `0/${seconds} * * * * *`, async () => {
        let gifURL;
        jobData = jobs[jobIndex]
        if( jobData.count === 3){
            const randomNum = Math.floor(Math.random() * jobData.gifs.length)
            gifURL = jobData.gifs[randomNum]
        }
        else{
            gifURL = await giphy.getGif(subject);
            while(jobs[jobIndex].gifs.find((g)=> g === gifURL)){
                gifURL = await giphy.getGif(subject);
            }
            jobs[jobIndex].gifs.push(gifURL)
            jobs[jobIndex].count ++
        }
        await job.findOneAndUpdate({_id: jobId}, {$push: {gifs: gifURL}})

        socket.to(userId).emit('newGif', {url:gifURL,subject});
    });
    manager.start(`${subject}-${userId}`);
}


const removeJob = (key,userId) => {
    key = `${key}-${userId}`
    if (manager.exists(key)) {
        manager.deleteJob(key)
    }
    manager.listCrons();
}


module.exports = {createJob, removeJob}