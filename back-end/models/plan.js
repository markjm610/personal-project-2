const mongoose = require('mongoose')

const Schema = mongoose.Schema

const planSchema = new Schema({
    name: { type: String, required: true, unique: true },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    startDate: { type: [Number], required: true },
    endDate: { type: [Number], required: true },
    graphData: { type: Array }

})

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;