const mongoose = require('mongoose')

const Schema = mongoose.Schema

const investmentSchema = new Schema({
    name: { type: String, required: true },
    date: { type: Number, required: true },
    amount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    planId: { type: mongoose.Types.ObjectId, required: true, ref: 'Plan' }
})

const Investment = mongoose.model('Investment', investmentSchema)

module.exports = Investment