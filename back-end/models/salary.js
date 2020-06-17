const mongoose = require('mongoose')

const Schema = mongoose.Schema

const salarySchema = new Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    amountPerYear: { type: Number, required: true },
    taxRate: { type: Number },
    afterTaxAmount: { type: Number },
    planId: { type: mongoose.Types.ObjectId, required: true, ref: 'Plan' }
})

const Salary = mongoose.model('Salary', salarySchema)

module.exports = Salary