const express = require('express');
const Salary = require('../models/salary');
const Plan = require('../models/plan');

const router = express.Router();

const asyncHandler = handler => (req, res, next) => handler(req, res, next).catch(next);

router.post('/salaries', asyncHandler(async (req, res) => {
    const { name, startDate, endDate, amountPerYear, taxRate, afterTaxAmount, planId } = req.body;

    const newSalary = new Salary({ name, startDate, endDate, amountPerYear, taxRate, afterTaxAmount, planId })
    await newSalary.save()
    res.json(newSalary)

}))

router.get('/plans/:planId/salaries', asyncHandler(async (req, res) => {
    const planId = req.params.planId

    const salaries = await Salary.find({ planId })

    res.json(salaries)

}))


module.exports = router;