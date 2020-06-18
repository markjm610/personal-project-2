const express = require('express');
const Plan = require('../models/plan');
const Salary = require('../models/salary')
const Expense = require('../models/expense')

const router = express.Router();

const asyncHandler = handler => (req, res, next) => handler(req, res, next).catch(next);

router.post('/plans', asyncHandler(async (req, res) => {
    const { name, startDate, endDate } = req.body;

    const startMilliseconds = new Date(startDate[0], startDate[1], startDate[2]).getTime()

    const endMilliseconds = new Date(endDate[0], endDate[1], endDate[2]).getTime()

    const days = (endMilliseconds - startMilliseconds) / (1000 * 60 * 60 * 24)

    let graphData = []
    const startYear = startDate[0]
    const startMonth = startDate[1]
    const startDay = startDate[2]

    for (let i = 0; i < days; i++) {

        graphData.push({
            x: new Date(startYear, startMonth, i + startDay), y: 0
        })

    }
    console.log(graphData)

    const newPlan = new Plan({ name, startDate, endDate, graphData })
    await newPlan.save()
    res.json(newPlan)

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