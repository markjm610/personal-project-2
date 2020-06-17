const express = require('express');
const Expense = require('../models/expense');

const router = express.Router();

const asyncHandler = handler => (req, res, next) => handler(req, res, next).catch(next);

router.post('/expenses', asyncHandler(async (req, res) => {

    const { name, date, amount, repeatingInterval, planId } = req.body

    const newExpense = new Expense({ name, date, amount, repeatingInterval, planId })

    await newExpense.save()

    res.json(newExpense)

}))

module.exports = router;