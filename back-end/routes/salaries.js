const express = require('express');
const Salary = require('../models/salary');
const Plan = require('../models/plan');
const Expense = require('../models/expense');

const router = express.Router();

const asyncHandler = handler => (req, res, next) => handler(req, res, next).catch(next);

router.post('/salaries', asyncHandler(async (req, res) => {
    const { name, startDate, endDate, amountPerYear, taxRate, afterTaxAmount, planId } = req.body;


    const plan = await Plan.findById(planId)

    const graphDataArr = plan.graphData
    const startDateObj = new Date(startDate[0], startDate[1], startDate[2])

    let firstDayIndex;

    graphDataArr.forEach((datapoint, i) => {
        if (datapoint.x.getTime() === startDateObj.getTime()) {
            firstDayIndex = i
        }
    })

    const startMilliseconds = new Date(startDate[0], startDate[1], startDate[2]).getTime()
    const endMilliseconds = new Date(endDate[0], endDate[1], endDate[2]).getTime()

    const dayDifference = (endMilliseconds - startMilliseconds) / (1000 * 60 * 60 * 24)

    let daysPassed = 0

    for (let i = firstDayIndex; i < graphDataArr.length; i++) {

        if (i < firstDayIndex + dayDifference) {
            // For every day in salary period, add that day's proportion of salary to total
            daysPassed++

            const amountToAdd = afterTaxAmount / 365 * daysPassed

            graphDataArr[i].y += amountToAdd
        } else {
            // Once salary period is over, add full amount every day to total
            graphDataArr[i].y += afterTaxAmount / 365 * daysPassed
        }


    }

    await plan.updateOne({ graphData: graphDataArr })

    const newSalary = new Salary({
        name,
        startDate,
        endDate,
        startDateMilliseconds: startMilliseconds,
        endDateMilliseconds: endMilliseconds,
        amountPerYear,
        taxRate,
        afterTaxAmount,
        displayed: true,
        planId
    })

    await newSalary.save()

    res.json({ plan, newSalary })

}))

router.get('/plans/:planId/salaries', asyncHandler(async (req, res) => {
    const planId = req.params.planId

    const salaries = await Salary.find({ planId })

    res.json(salaries)

}))

router.put('/plans/:planId/salaries/:salaryId', asyncHandler(async (req, res) => {
    // Toggle
    const planId = req.params.planId
    const salaryId = req.params.salaryId
    const { displayed } = req.body
    const salary = await Salary.findById(salaryId)

    const plan = await Plan.findById(planId)

    let graphDataArr = plan.graphData

    const startMilliseconds = salary.startDateMilliseconds
    const endMilliseconds = salary.endDateMilliseconds


    let firstDayIndex;

    graphDataArr.forEach((datapoint, i) => {
        if (datapoint.x.getTime() === startMilliseconds) {
            firstDayIndex = i
        }
    })


    const dayDifference = (endMilliseconds - startMilliseconds) / (1000 * 60 * 60 * 24)

    let daysPassed = 0

    for (let i = firstDayIndex; i < graphDataArr.length; i++) {

        if (i < firstDayIndex + dayDifference) {

            daysPassed++

            const amountToAdd = salary.afterTaxAmount / 365 * daysPassed
            if (displayed) {
                graphDataArr[i].y += amountToAdd
            } else {
                graphDataArr[i].y -= amountToAdd
            }

        } else {
            if (displayed) {
                graphDataArr[i].y += salary.afterTaxAmount / 365 * daysPassed
            } else {
                graphDataArr[i].y -= salary.afterTaxAmount / 365 * daysPassed
            }

        }


    }

    await salary.updateOne({ displayed: displayed })

    if (!displayed) {

        // Have to not include currently updating salary
        let allToggledOff = true
        const salaries = await Salary.find({ planId })
        const expenses = await Expense.find({ planId })

        salaries.forEach(({ displayed }) => {
            if (displayed) {
                allToggledOff = false
            } else {
                return
            }
        })

        expenses.forEach(({ displayed }) => {
            if (displayed) {
                allToggledOff = false
            } else {
                return
            }
        })

        if (allToggledOff) {

            graphDataArr = graphDataArr.map(datapoint => {
                return { x: datapoint.x, y: 0 }
            })

        }

    }



    await plan.updateOne({ graphData: graphDataArr })

    res.json(plan)

}))

router.patch('/plans/:planId/salaries/:salaryId/amount', asyncHandler(async (req, res) => {
    const salaryId = req.params.salaryId
    const planId = req.params.planId
    const { amountPerYear, taxRate, afterTaxAmount } = req.body

    const plan = await Plan.findById(planId)

    const salary = await Salary.findByIdAndUpdate(salaryId, {
        amountPerYear,
        taxRate,
        afterTaxAmount
    })

    let graphDataArr = plan.graphData

    const startMilliseconds = salary.startDateMilliseconds
    const endMilliseconds = salary.endDateMilliseconds


    let firstDayIndex;

    graphDataArr.forEach((datapoint, i) => {
        if (datapoint.x.getTime() === startMilliseconds) {
            firstDayIndex = i
        }
    })


    const dayDifference = (endMilliseconds - startMilliseconds) / (1000 * 60 * 60 * 24)

    let daysPassed = 0

    for (let i = firstDayIndex; i < graphDataArr.length; i++) {

        if (i < firstDayIndex + dayDifference) {
            daysPassed++
            const amountToAdd = salary.afterTaxAmount / 365 * daysPassed
            graphDataArr[i].y -= amountToAdd
        } else {
            graphDataArr[i].y -= salary.afterTaxAmount / 365 * daysPassed
        }
    }

    daysPassed = 0

    for (let i = firstDayIndex; i < graphDataArr.length; i++) {

        if (i < firstDayIndex + dayDifference) {
            daysPassed++
            const amountToAdd = afterTaxAmount / 365 * daysPassed
            graphDataArr[i].y += amountToAdd
        } else {
            graphDataArr[i].y += afterTaxAmount / 365 * daysPassed
        }
    }

    await plan.updateOne({ graphData: graphDataArr })

    res.json(plan)

}))



router.patch('/plans/:planId/salaries/:salaryId/date', asyncHandler(async (req, res) => {
    const salaryId = req.params.salaryId
    const planId = req.params.planId
    const { startDate, endDate } = req.body

    const newStartMilliseconds = new Date(startDate[0], startDate[1], startDate[2]).getTime()
    const newEndMilliseconds = new Date(endDate[0], endDate[1], endDate[2]).getTime()

    const salary = await Salary.findByIdAndUpdate(salaryId, {
        startDate,
        endDate,
        startDateMilliseconds: newStartMilliseconds,
        endDateMilliseconds: newEndMilliseconds
    })

    const plan = await Plan.findById(planId)

    const graphDataArr = plan.graphData

    let firstDayIndex;

    graphDataArr.forEach((datapoint, i) => {
        if (datapoint.x.getTime() === salary.startDateMilliseconds) {
            firstDayIndex = i
        }
    })

    const dayDifference = (salary.endDateMilliseconds - salary.startDateMilliseconds) / (1000 * 60 * 60 * 24)

    let daysPassed = 0

    for (let i = firstDayIndex; i < graphDataArr.length; i++) {

        if (i < firstDayIndex + dayDifference) {

            daysPassed++

            const amountToAdd = salary.afterTaxAmount / 365 * daysPassed

            graphDataArr[i].y -= amountToAdd


        } else {

            graphDataArr[i].y -= salary.afterTaxAmount / 365 * daysPassed

        }


    }



    const newDayDifference = (newEndMilliseconds - newStartMilliseconds) / (1000 * 60 * 60 * 24)

    let newFirstDayIndex;

    graphDataArr.forEach((datapoint, i) => {
        if (datapoint.x.getTime() === newStartMilliseconds) {
            newFirstDayIndex = i
        }
    })

    let newDaysPassed = 0


    for (let i = newFirstDayIndex; i < graphDataArr.length; i++) {

        if (i < newFirstDayIndex + newDayDifference) {

            newDaysPassed++

            const amountToAdd = salary.afterTaxAmount / 365 * newDaysPassed

            graphDataArr[i].y += amountToAdd
        } else {

            graphDataArr[i].y += salary.afterTaxAmount / 365 * newDaysPassed
        }
    }

    await plan.updateOne({ graphData: graphDataArr })

    res.json(plan)

}))




module.exports = router;