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

        // Need to subtract expense every day, only increase the amount subtracted every month

        const day = dateObj.getDate()

        let monthsPassed = 0
        let currentMonth = dateObj.getMonth()
        let foundDayInMonth = false

        for (let i = firstDayIndex; i < graphDataArr.length; i++) {

            if (graphDataArr[i].x.getMonth() !== currentMonth) {
                // Update month

                currentMonth = graphDataArr[i].x.getMonth()
                foundDayInMonth = false
            }

            if (graphDataArr[i].x.getMonth() === currentMonth && graphDataArr[i].x.getDate() === day) {
                monthsPassed++
                foundDayInMonth = true;
            }

            if (graphDataArr[i + 1] && graphDataArr[i].x.getMonth() !== graphDataArr[i + 1].x.getMonth() && !foundDayInMonth) {
                monthsPassed++
            }

            graphDataArr[i].y -= (amount * monthsPassed)

        }

    } else if (repeatingInterval === 'Yearly') {

        // Might be able to check for February 29, and if so then add an extra day
        // to prevent being off by one the rest of the year

        const day = dateObj.getDate()
        const month = dateObj.getMonth()
        let yearsPassed = 0
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {

            if (graphDataArr[i].x.getMonth() === month && graphDataArr[i].x.getDate() === day) {
                yearsPassed++
                graphDataArr[i].y -= (amount * yearsPassed)
            }


            // if ()

        }
    }


    await plan.updateOne({ graphData: graphDataArr })

    const newExpense = new Expense({ description, date, amount, repeatingInterval, dateMilliseconds, planId })

    await newExpense.save()

    res.json(plan)

    // res.json('res')

}))

module.exports = router;