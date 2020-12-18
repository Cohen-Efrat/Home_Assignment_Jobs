const express = require('express')
require('dotenv').config()
require('./db/mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const userModel = require('./models/user')
const userRouter = require('./routers/user')
const jobRouter = require('./routers/job')
const cronManager = require('./utils/cronManager')

const initData = async () => {
    const user = new userModel({
        name: "Jane Doe",
        email: "JaneDoe@gmail.com",
        password: "paSSw0rd",
        tokens: [],
    })
    await user.save()
}
// initData()

const app = express()
const port = process.env.PORT || 5000

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(express.json())
app.use(userRouter)
app.use(jobRouter)

app.listen(port, () => {
    console.log('Server is listening on port: ' + port)
})

const options = {};
const io = require('socket.io')(4000, options);

const getUser = async (token)=>{
    const decoded = jwt.verify(token, process.env.JWT_SIGNATURE)
    const user = await userModel.findOne({ _id: decoded._id, 'tokens.token': token })
    return user
}

io.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("join", async ({token}) => {
        const user = await getUser(token)
        if(user){
            socket.join(user._id)
        }
    });
    socket.on("addJob", async ({subject, seconds, jobId, token}) => {
        const user = await getUser(token)
        if(user){
            cronManager.createJob(subject, seconds, jobId, user._id, socket)
        }
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});
