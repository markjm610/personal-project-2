const mongoose = require('mongoose')

const Schema = mongoose.Schema

const expenseSchema = new Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    repeatingInterval: { type: String, required: true },
    planId: { type: mongoose.Types.ObjectId, required: true, ref: 'Plan' }
})

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense