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
    } else if (repeatingInterval === 'Weekly') {
        let weeksPassed = 0
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {
            if ((i - firstDayIndex) % 7 === 0) {
                weeksPassed++
            }

            graphDataArr[i].y -= (amount * weeksPassed)
        }

    } else if (repeatingInterval === 'Monthly') {

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


        const day = dateObj.getDate()
        const month = dateObj.getMonth()
        let yearsPassed = 0
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {

            if (graphDataArr[i].x.getMonth() === month && graphDataArr[i].x.getDate() === day) {
                yearsPassed++
            }

            if (month === 1 && day === 29 && graphDataArr[i].x.getMonth() === 1) {

                if (graphDataArr[i + 1]
                    && graphDataArr[i].x.getMonth() !== graphDataArr[i + 1].x.getMonth()
                    && graphDataArr[i].x.getDate() === 28) {

                    yearsPassed++
                }
            }

            graphDataArr[i].y -= (amount * yearsPassed)

        }
    }


    await plan.updateOne({ graphData: graphDataArr })

    const newExpense = new Expense({
        description,
        date,
        amount,
        repeatingInterval,
        dateMilliseconds,
        displayed: true,
        planId
    })

    await newExpense.save()

    res.json({ plan, newExpense })

}))

router.put('/plans/:planId/expenses/:expenseId', asyncHandler(async (req, res) => {
    const expenseId = req.params.expenseId
    const { displayed } = req.body
    const expense = await Expense.findById(expenseId)

    const planId = req.params.planId
    const plan = await Plan.findById(planId)

    const graphDataArr = plan.graphData
    // const dateObj = new Date(date[0], date[1], date[2])
    const dateMilliseconds = expense.dateMilliseconds

    let firstDayIndex;

    graphDataArr.forEach((datapoint, i) => {
        if (datapoint.x.getTime() === dateMilliseconds) {
            firstDayIndex = i
        }
    })

    if (!expense.repeatingInterval) {
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {
            if (displayed) {
                graphDataArr[i].y -= expense.amount
            } else {
                graphDataArr[i].y += expense.amount
            }

        }
    } else if (expense.repeatingInterval === 'Daily') {
        let daysPassed = 0
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {
            daysPassed++
            if (displayed) {
                graphDataArr[i].y -= (expense.amount * daysPassed)
            } else {
                graphDataArr[i].y += (expense.amount * daysPassed)
            }

        }
    } else if (expense.repeatingInterval === 'Weekly') {
        let weeksPassed = 0
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {
            if ((i - firstDayIndex) % 7 === 0) {
                weeksPassed++
            }

            if (displayed) {
                graphDataArr[i].y -= (expense.amount * weeksPassed)
            } else {
                graphDataArr[i].y += (expense.amount * weeksPassed)
            }

        }
    } else if (expense.repeatingInterval === 'Monthly') {

        // Need to subtract expense every day, only increase the amount subtracted every month
        const dateObj = new Date(expense.dateMilliseconds)
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

            if (displayed) {
                graphDataArr[i].y -= (expense.amount * monthsPassed)
            } else {
                graphDataArr[i].y += (expense.amount * monthsPassed)
            }


        }

    } else if (expense.repeatingInterval === 'Yearly') {

        const dateObj = new Date(expense.dateMilliseconds)
        const day = dateObj.getDate()
        const month = dateObj.getMonth()
        let yearsPassed = 0
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {

            if (graphDataArr[i].x.getMonth() === month && graphDataArr[i].x.getDate() === day) {
                yearsPassed++
            }

            if (month === 1 && day === 29 && graphDataArr[i].x.getMonth() === 1) {

                if (graphDataArr[i + 1]
                    && graphDataArr[i].x.getMonth() !== graphDataArr[i + 1].x.getMonth()
                    && graphDataArr[i].x.getDate() === 28) {

                    yearsPassed++
                }
            }

            if (displayed) {
                graphDataArr[i].y -= (expense.amount * yearsPassed)
            } else {
                graphDataArr[i].y += (expense.amount * yearsPassed)
            }


        }
    }


    await plan.updateOne({ graphData: graphDataArr })
    await expense.updateOne({ displayed: displayed })

    res.json(plan)

}))

router.patch('/plans/:planId/expenses/:expenseId/amount', asyncHandler(async (req, res) => {

    const planId = req.params.planId
    const expenseId = req.params.expenseId

    const { amount } = req.body

    const expense = await Expense.findByIdAndUpdate(expenseId, { amount })

    const plan = await Plan.findById(planId)

    const graphDataArr = plan.graphData
    // const dateObj = new Date(date[0], date[1], date[2])
    const dateMilliseconds = expense.dateMilliseconds

    let firstDayIndex;

    graphDataArr.forEach((datapoint, i) => {
        if (datapoint.x.getTime() === dateMilliseconds) {
            firstDayIndex = i
        }
    })

    if (!expense.repeatingInterval) {
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {

            graphDataArr[i].y += expense.amount


        }
    } else if (expense.repeatingInterval === 'Daily') {
        let daysPassed = 0
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {
            daysPassed++

            graphDataArr[i].y += (expense.amount * daysPassed)


        }
    } else if (expense.repeatingInterval === 'Weekly') {
        let weeksPassed = 0
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {
            if ((i - firstDayIndex) % 7 === 0) {
                weeksPassed++
            }


            graphDataArr[i].y += (expense.amount * weeksPassed)


        }
    } else if (expense.repeatingInterval === 'Monthly') {

        // Need to subtract expense every day, only increase the amount subtracted every month
        const dateObj = new Date(expense.dateMilliseconds)
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


            graphDataArr[i].y += (expense.amount * monthsPassed)

        }

    } else if (expense.repeatingInterval === 'Yearly') {

        const dateObj = new Date(expense.dateMilliseconds)
        const day = dateObj.getDate()
        const month = dateObj.getMonth()
        let yearsPassed = 0
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {

            if (graphDataArr[i].x.getMonth() === month && graphDataArr[i].x.getDate() === day) {
                yearsPassed++
            }

            if (month === 1 && day === 29 && graphDataArr[i].x.getMonth() === 1) {

                if (graphDataArr[i + 1]
                    && graphDataArr[i].x.getMonth() !== graphDataArr[i + 1].x.getMonth()
                    && graphDataArr[i].x.getDate() === 28) {

                    yearsPassed++
                }
            }

            graphDataArr[i].y += (expense.amount * yearsPassed)



        }
    }


    if (!expense.repeatingInterval) {
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {

            graphDataArr[i].y -= amount


        }
    } else if (expense.repeatingInterval === 'Daily') {
        let daysPassed = 0
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {
            daysPassed++

            graphDataArr[i].y -= (amount * daysPassed)


        }
    } else if (expense.repeatingInterval === 'Weekly') {
        let weeksPassed = 0
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {
            if ((i - firstDayIndex) % 7 === 0) {
                weeksPassed++
            }


            graphDataArr[i].y -= (amount * weeksPassed)


        }
    } else if (expense.repeatingInterval === 'Monthly') {

        // Need to subtract expense every day, only increase the amount subtracted every month
        const dateObj = new Date(expense.dateMilliseconds)
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

    } else if (expense.repeatingInterval === 'Yearly') {

        const dateObj = new Date(expense.dateMilliseconds)
        const day = dateObj.getDate()
        const month = dateObj.getMonth()
        let yearsPassed = 0
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {

            if (graphDataArr[i].x.getMonth() === month && graphDataArr[i].x.getDate() === day) {
                yearsPassed++
            }

            if (month === 1 && day === 29 && graphDataArr[i].x.getMonth() === 1) {

                if (graphDataArr[i + 1]
                    && graphDataArr[i].x.getMonth() !== graphDataArr[i + 1].x.getMonth()
                    && graphDataArr[i].x.getDate() === 28) {

                    yearsPassed++
                }
            }

            graphDataArr[i].y -= (amount * yearsPassed)



        }
    }

    await plan.updateOne({ graphData: graphDataArr })

    res.json(plan)
}))


router.patch('/plans/:planId/expenses/:expenseId/date', asyncHandler(async (req, res) => {

    const planId = req.params.planId
    const expenseId = req.params.expenseId

    const { date } = req.body

    const expense = await Expense.findByIdAndUpdate(expenseId, { date })
    const plan = await Plan.findById(planId)
    const graphDataArr = plan.graphData


    const dateMilliseconds = expense.dateMilliseconds

    let firstDayIndex;

    graphDataArr.forEach((datapoint, i) => {
        if (datapoint.x.getTime() === dateMilliseconds) {
            firstDayIndex = i
        }
    })

    if (!expense.repeatingInterval) {
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {

            graphDataArr[i].y += expense.amount


        }
    } else if (expense.repeatingInterval === 'Daily') {
        let daysPassed = 0
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {
            daysPassed++

            graphDataArr[i].y += (expense.amount * daysPassed)


        }
    } else if (expense.repeatingInterval === 'Weekly') {
        let weeksPassed = 0
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {
            if ((i - firstDayIndex) % 7 === 0) {
                weeksPassed++
            }


            graphDataArr[i].y += (expense.amount * weeksPassed)


        }
    } else if (expense.repeatingInterval === 'Monthly') {

        // Need to subtract expense every day, only increase the amount subtracted every month
        const dateObj = new Date(expense.dateMilliseconds)
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


            graphDataArr[i].y += (expense.amount * monthsPassed)

        }

    } else if (expense.repeatingInterval === 'Yearly') {

        const dateObj = new Date(expense.dateMilliseconds)
        const day = dateObj.getDate()
        const month = dateObj.getMonth()
        let yearsPassed = 0
        for (let i = firstDayIndex; i < graphDataArr.length; i++) {

            if (graphDataArr[i].x.getMonth() === month && graphDataArr[i].x.getDate() === day) {
                yearsPassed++
            }

            if (month === 1 && day === 29 && graphDataArr[i].x.getMonth() === 1) {

                if (graphDataArr[i + 1]
                    && graphDataArr[i].x.getMonth() !== graphDataArr[i + 1].x.getMonth()
                    && graphDataArr[i].x.getDate() === 28) {

                    yearsPassed++
                }
            }

            graphDataArr[i].y += (expense.amount * yearsPassed)



        }
    }

    const dateObj = new Date(date[0], date[1], date[2])
    const newDateMilliseconds = dateObj.getTime()

    let newFirstDayIndex;

    graphDataArr.forEach((datapoint, i) => {
        if (datapoint.x.getTime() === newDateMilliseconds) {
            newFirstDayIndex = i
        }
    })

    if (!expense.repeatingInterval) {
        for (let i = newFirstDayIndex; i < graphDataArr.length; i++) {
            graphDataArr[i].y -= expense.amount
        }
    } else if (expense.repeatingInterval === 'Daily') {
        let daysPassed = 0
        for (let i = newFirstDayIndex; i < graphDataArr.length; i++) {
            daysPassed++
            graphDataArr[i].y -= (expense.amount * daysPassed)
        }
    } else if (expense.repeatingInterval === 'Weekly') {
        let weeksPassed = 0
        for (let i = newFirstDayIndex; i < graphDataArr.length; i++) {
            if ((i - newFirstDayIndex) % 7 === 0) {
                weeksPassed++
            }

            graphDataArr[i].y -= (expense.amount * weeksPassed)
        }

    } else if (expense.repeatingInterval === 'Monthly') {

        const day = dateObj.getDate()

        let monthsPassed = 0
        let currentMonth = dateObj.getMonth()
        let foundDayInMonth = false

        for (let i = newFirstDayIndex; i < graphDataArr.length; i++) {

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

            graphDataArr[i].y -= (expense.amount * monthsPassed)

        }

    } else if (expense.repeatingInterval === 'Yearly') {


        const day = dateObj.getDate()
        const month = dateObj.getMonth()
        let yearsPassed = 0
        for (let i = newFirstDayIndex; i < graphDataArr.length; i++) {

            if (graphDataArr[i].x.getMonth() === month && graphDataArr[i].x.getDate() === day) {
                yearsPassed++
            }

            if (month === 1 && day === 29 && graphDataArr[i].x.getMonth() === 1) {

                if (graphDataArr[i + 1]
                    && graphDataArr[i].x.getMonth() !== graphDataArr[i + 1].x.getMonth()
                    && graphDataArr[i].x.getDate() === 28) {

                    yearsPassed++
                }
            }

            graphDataArr[i].y -= (expense.amount * yearsPassed)

        }
    }




    await plan.updateOne({ graphData: graphDataArr })

    res.json(plan)


}))




module.exports = router;