const mongoose = require('mongoose')

const Schema = mongoose.Schema

const planSchema = new Schema({
    name: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    userId: {
        type: mongoose.Types.ObjectId,
        // required: true, 
        unique: true, ref: 'User'
    }
})

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;