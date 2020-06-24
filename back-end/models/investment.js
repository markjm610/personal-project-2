const mongoose = require('mongoose')

const Schema = mongoose.Schema

const investmentSchema = new Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    sellDate: { type: Number },
    planId: { type: mongoose.Types.ObjectId, required: true, ref: 'Plan' }
})

const Investment = mongoose.model('Investment', investmentSchema)

module.exports = Investment