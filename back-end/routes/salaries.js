const express = require('express');
const Salary = require('../models/salary');
const Plan = require('../models/plan');

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

    res.json(plan)

}))

router.get('/plans/:planId/salaries', asyncHandler(async (req, res) => {
    const planId = req.params.planId

    const salaries = await Salary.find({ planId })

    res.json(salaries)

}))

router.put('/plans/:planId/salaries/:salaryId', asyncHandler(async (req, res) => {
    const planId = req.params.planId
    const salaryId = req.params.salaryId
    const { displayed } = req.body
    const salary = await Salary.findById(salaryId)

    const plan = await Plan.findById(planId)

    const graphDataArr = plan.graphData

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
    await plan.updateOne({ graphData: graphDataArr })

    res.json(plan)

}))

router.patch('/plans/:planId/salaries/:salaryId/amount', asyncHandler(async (req, res) => {
    const salaryId = req.params.salaryId
    const planId = req.params.planId
    const { amountPerYear, taxRate, afterTaxAmount } = req.body

    // Returns previous salary, not the updated version
    const previousSalary = await Salary.findByIdAndUpdate(salaryId, {
        amountPerYear,
        taxRate,
        afterTaxAmount
    })

    const afterTaxAmountDifference = afterTaxAmount - previousSalary.afterTaxAmount

    const plan = await Plan.findById(planId)

    const graphDataArr = plan.graphData

    const startMilliseconds = new Date(previousSalary.startDate[0], previousSalary.startDate[1], previousSalary.startDate[2]).getTime()
    const endMilliseconds = new Date(previousSalary.endDate[0], previousSalary.endDate[1], previousSalary.endDate[2]).getTime()

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
            // For every day in salary period, add that day's proportion of salary to total
            daysPassed++

            const amountToAdd = afterTaxAmountDifference / 365 * daysPassed

            graphDataArr[i].y += amountToAdd
        } else {
            // Once salary period is over, add full amount every day to total
            graphDataArr[i].y += afterTaxAmountDifference / 365 * daysPassed
        }


    }

    await plan.updateOne({ graphData: graphDataArr })

    res.json(plan)

}))



router.patch('/plans/:planId/salaries/:salaryId/date', asyncHandler(async (req, res) => {
    const salaryId = req.params.salaryId
    const planId = req.params.planId
    const { startDate, endDate } = req.body

    const previousSalary = await Salary.findById(salaryId)

    const plan = await Plan.findById(planId)

    const graphDataArr = plan.graphData

    const startMilliseconds = previousSalary.startDateMilliseconds
    const endMilliseconds = previousSalary.endDateMilliseconds

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

            const amountToAdd = previousSalary.afterTaxAmount / 365 * daysPassed

            graphDataArr[i].y -= amountToAdd


        } else {

            graphDataArr[i].y -= previousSalary.afterTaxAmount / 365 * daysPassed

        }


    }

    const newStartMilliseconds = new Date(startDate[0], startDate[1], startDate[2]).getTime()
    const newEndMilliseconds = new Date(endDate[0], endDate[1], endDate[2]).getTime()

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

            const amountToAdd = previousSalary.afterTaxAmount / 365 * newDaysPassed

            graphDataArr[i].y += amountToAdd
        } else {

            graphDataArr[i].y += previousSalary.afterTaxAmount / 365 * newDaysPassed
        }


    }


    await plan.updateOne({ graphData: graphDataArr })

    await Salary.findByIdAndUpdate(salaryId, {
        startDate,
        endDate,
        startDateMilliseconds: newStartMilliseconds,
        endDateMilliseconds: newEndMilliseconds
    })


    res.json(plan)

}))




module.exports = router;