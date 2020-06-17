const mongoose = require('mongoose')

const Schema = mongoose.Schema

const loanSchema = new Schema({
    name: { type: String, required: true },
    day: { type: Number, required: true },
    amount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    paydownAmount: { type: Number, required: true },
    paydownInterval: { type: Number, required: true },
    planId: { type: mongoose.Types.ObjectId, required: true, ref: 'Plan' }
})

const Loan = mongoose.model('Loan', loanSchema)

module.exports = Loan