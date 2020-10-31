const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
        trim: true
    },
    frequency: {
        type: Number,
        required: true,
        validate(value) {
            if(value > 59 || value < 1){
                throw new Error('Must be a number between 1 - 59')
            }
        }
    },
    gifs:[{type:String}],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

}, {
    timestamps: true
})


const Job = mongoose.model('Job', jobSchema)

module.exports = Job