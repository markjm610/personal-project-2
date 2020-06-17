const mongoose = require('mongoose')

const Schema = mongoose.Schema

const expenseSchema = new Schema({
    name: { type: String, required: true },
    repeatingInterval: { type: Number, required: true },
    planId: { type: mongoose.Types.ObjectId, required: true, ref: 'Plan' }
})

const Expense = mongoose.model('Expense', expenseSchema)

module.exports = Expense