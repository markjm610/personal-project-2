const express = require('express');
const Plan = require('../models/plan');
const Salary = require('../models/salary')
const Expense = require('../models/expense')

const router = express.Router();

const asyncHandler = handler => (req, res, next) => handler(req, res, next).catch(next);

router.post('/plans', asyncHandler(async (req, res) => {
    const { name, startDate } = req.body;

    const newPlan = new Plan({ name, startDate })
    newPlan.save()
    res.json('Plan saved')

}))

router.get('/users/:userId/plans', asyncHandler(async (req, res) => {


}))

router.get('/plans/:planId', asyncHandler(async (req, res) => {
    const planId = req.params.planId

    const plans = await Plan.find()
    const salaries = await Salary.find({ planId })
    const expenses = await Expense.find({ planId })
    res.json({ plans, salaries, expenses })

}))

module.exports = router;