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


    const newPlan = new Plan({ name, startDate, endDate, graphData })
    await newPlan.save()
    res.json(newPlan)

}))

router.get('/users/:userId/plans', asyncHandler(async (req, res) => {


}))

router.get('/plans/:planId', asyncHandler(async (req, res) => {
    const planId = req.params.planId

    const plan = await Plan.findById(planId)

    res.json(plan)

}))


router.put('/plans/:planId', asyncHandler(async (req, res) => {
    const planId = req.params.planId

    const { date } = req.body
    const splitDate = date.slice(0, 10).split('-')
    const numArr = splitDate.map(num => {
        return parseInt(num)
    })

    const dateObj = new Date(numArr[0], numArr[1] - 1, numArr[2])
    const dateMilliseconds = dateObj.getTime()
    const planSalaries = await Salary.find({ planId })

    let salaries = []
    planSalaries.forEach(salary => {
        if (salary.startDateMilliseconds <= dateMilliseconds && salary.endDateMilliseconds >= dateMilliseconds) {
            salaries.push(salary)
        }
    })

    const planExpenses = await Expense.find({ planId })

    let expenses = []
    const thirtyDaysInMilliseconds = 2592000000

    // Gets expenses from last month
    // Will have to change once expenses have end dates
    // Maybe should be last 30 days
    planExpenses.forEach(expense => {
        if (expense.dateMilliseconds <= dateMilliseconds) {
            if (!expense.repeatingInterval && (expense.dateMilliseconds + thirtyDaysInMilliseconds) >= dateMilliseconds) {
                expenses.push(expense)
            } else if (expense.repeatingInterval === 'Daily'
                || expense.repeatingInterval === 'Weekly'
                || expense.repeatingInterval === 'Monthly') {
                expenses.push(expense)
            } else if (expense.repeatingInterval === 'Yearly') {
                // If starting date of expense is within last 30 days, you don't have to do anything else
                if ((expense.dateMilliseconds + thirtyDaysInMilliseconds) >= dateMilliseconds) {
                    expenses.push(expense)
                } else {
                    // Get most recent repetition of the expense before the clicked date 
                    // Compare that to clicked date (dateMilliseconds)
                    let lastRepetition = expense.dateMilliseconds + 'one year later'
                    let currentRepetition = expense.dateMilliseconds + 'two years later'
                    // Time complexity? Way to get it back down to n?
                    while (lastRepetition < dateMilliseconds) {
                        if (currentRepetition = dateMilliseconds) {
                            expenses.push(expense)
                        } else if (currentRepetition > dateMilliseconds) {
                            if ((lastRepetition + thirtyDaysInMilliseconds) >= dateMilliseconds) {
                                expenses.push(expense)
                            }
                        } else {
                            lastRepetition = currentRepetition
                            currentRepetition += 'year'
                        }
                    }


                }

            }
        }
    })


    res.json({ salaries, expenses })

}))


module.exports = router;