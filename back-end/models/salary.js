const mongoose = require('mongoose')

const Schema = mongoose.Schema

const salarySchema = new Schema({
    name: { type: String, required: true },
    amountPerYear: { type: String, required: true },
    tax: { type: Number },
    planId: { type: mongoose.Types.ObjectId, required: true, ref: 'Plan' }
})

const Salary = mongoose.model('Salary', salarySchema)

module.exports = Salary