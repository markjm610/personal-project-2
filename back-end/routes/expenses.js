const express = require('express');
const Expense = require('../models/expense');
const Plan = require('../models/plan');

const router = express.Router();

const asyncHandler = handler => (req, res, next) => handler(req, res, next).catch(next);

router.post('/expenses', asyncHandler(async (req, res) => {

    const { description, date, amount, repeatingInterval, planId } = req.body

    const plan = await Plan.findById(planId)

    const graphDataArr = plan.graphData
    const dateObj = new Date(date[0], date[1], date[2])

    let firstDayIndex;

    graphDataArr.forEach((datapoint, i) => {
        if (datapoint.x.getTime() === dateObj.getTime()) {
            firstDayIndex = i
        }
    })

    if (!repeatingInterval) {
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {
            graphDataArr[i].y -= amount
        }
    } else if (repeatingInterval === 'Daily') {
        let daysPassed = 0
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {
            daysPassed++
            graphDataArr[i].y -= (amount * daysPassed)
        }
    }
    else if (repeatingInterval === 'Monthly') {
        console.log(graphDataArr[0].x)
        // Only works for first of every month. Doesn't keep track of day
        let currentMonth = 'some way to get month'
        if ('month value' !== currentMonth) {
            currentMonth = 'month value'
            // subtract expense accumulation from total
        } else {
            // keep looping but don't subtract expense from total
        }
    }
    // else if (repeatingInterval === 'Yearly') {
    // same as month but for year
    // }


    await plan.updateOne({ graphData: graphDataArr })

    const newExpense = new Expense({ description, date, amount, repeatingInterval, planId })

    await newExpense.save()

    res.json(plan)

}))

module.exports = router;