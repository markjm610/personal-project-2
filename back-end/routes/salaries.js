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

        if (i <= firstDayIndex + dayDifference) {
            daysPassed++

            const amountToAdd = afterTaxAmount / dayDifference * daysPassed

            graphDataArr[i].y += amountToAdd
        } else {
            graphDataArr[i].y += afterTaxAmount
        }


    }

    await plan.updateOne({ graphData: graphDataArr })

    const newSalary = new Salary({ name, startDate, endDate, amountPerYear, taxRate, afterTaxAmount, planId })

    await newSalary.save()

    res.json(plan)

}))

router.get('/plans/:planId/salaries', asyncHandler(async (req, res) => {
    const planId = req.params.planId

    const salaries = await Salary.find({ planId })

    res.json(salaries)

}))


module.exports = router;