const mongoose = require('mongoose')

const Schema = mongoose.Schema

const expenseSchema = new Schema({
    description: { type: String, required: true },
    date: { type: [Number], required: true },
    dateMilliseconds: { type: Number },
    amount: { type: Number, required: true },
    repeatingInterval: { type: String },
    endDate: { type: [Number] },
    endDateMilliseconds: { type: Number },
    displayed: { type: Boolean, required: true },
    planId: { type: mongoose.Types.ObjectId, required: true, ref: 'Plan' }
})

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense