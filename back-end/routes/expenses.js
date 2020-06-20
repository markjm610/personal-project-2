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
    const dateMilliseconds = dateObj.getTime()

    let firstDayIndex;

    graphDataArr.forEach((datapoint, i) => {
        if (datapoint.x.getTime() === dateMilliseconds) {
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
        // console.log(graphDataArr[0].x)

        // Subtracts on date and first of every following month. Doesn't keep track of day. 
        // Could add conditional statements for day, but would have to take into account 31, 30, 29, and 28

        // When amount is subtracted, flip boolean value
        // If you're on the last day of a month and haven't subtracted expense yet, you know you've run out 
        // of days and have to subtract the expense

        let currentMonth = dateObj.getMonth()
        let day = dateObj.getDay()
        let monthsPassed = 0
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {

            // if (i === firstDayIndex) {
            //     monthsPassed++
            //     graphDataArr[i].y -= (amount * monthsPassed)
            // }

            if (graphDataArr[i].x.getMonth() !== currentMonth) {
                // Update month
                currentMonth = graphDataArr[i].x.getMonth()
            }

            if (graphDataArr[i].x.getMonth() === currentMonth && graphDataArr[i].getDay() === day) {
                monthsPassed++
                graphDataArr[i].y -= (amount * monthsPassed)
            }
        }

    }

    // else if (repeatingInterval === 'Yearly') {
    // same as month but for year
    // }


    // await plan.updateOne({ graphData: graphDataArr })

    // const newExpense = new Expense({ description, date, amount, repeatingInterval, dateMilliseconds, planId })

    // await newExpense.save()

    // res.json(plan)

    res.json('res')

}))

module.exports = router;