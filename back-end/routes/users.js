const express = require('express');

const User = require('../models/user')
const Plan = require('../models/plan');
const Salary = require('../models/salary')
const Expense = require('../models/expense')

const router = express.Router();

const asyncHandler = handler => (req, res, next) => handler(req, res, next).catch(next);

router.post('/users', asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    let user = await User.findOne({ email })

    if (!user) {
        user = new User({ name, email })
        await user.save()
        // const startDate = new Date()
        // const startDateArr = [startDate.getFullYear(), startDate.getMonth(), startDate.getDate()]
        // const endDate = new Date(startDate.getFullYear() + 5, startDate.getMonth(), startDate.getDate())
        // const endDateArr = [endDate.getFullYear() + 5, endDate.getMonth(), endDate.getDate()]
        // const startMilliseconds = startDate.getTime()
        // const endMilliseconds = endDate.getTime()

        // const days = (endMilliseconds - startMilliseconds) / (1000 * 60 * 60 * 24)

        // let graphData = []
        // const startYear = startDate[0]
        // const startMonth = startDate[1]
        // const startDay = startDate[2]

        // for (let i = 0; i <= days; i++) {

        //     graphData.push({
        //         x: new Date(startYear, startMonth, i + startDay), y: 0
        //     })

        // }

        // const firstPlan = new Plan({
        //     name: 'Sample Plan',
        //     userId: user._id,
        //     startDate: startDateArr,
        //     endDate: endDateArr,
        //     graphData: graphData
        // })

        // const salary1 = new Salary({
        //     name: 'Salary 1',
        //     planId: firstPlan._id,
        //     startDate: startDateArr,
        //     endDate: [startDateArr[0] + 2, 8, 30],
        //     startDateMilliseconds: startMilliseconds,
        //     endDateMilliseconds: new Date(startDateArr[0] + 2, 8, 30).getTime(),
        //     amountPerYear: 100000,
        //     taxRate: 0.10,
        //     afterTaxAmount: 90000,
        //     displayed: true,
        // })

        // const salary2 = new Salary({
        //     name: 'Salary 2',
        //     planId: firstPlan._id,
        //     startDate: [startDateArr[0] + 3, 1, 1],
        //     endDate: endDateArr,
        //     startDateMilliseconds: new Date(startDateArr[0] + 3, 1, 1).getTime(),
        //     endDateMilliseconds: endMilliseconds,
        //     amountPerYear: 200000,
        //     taxRate: 0.10,
        //     afterTaxAmount: 180000,
        //     displayed: true,
        // })

        // const netflixSubscription = new Expense({
        //     description: 'Netflix',
        //     date: startDateArr,
        //     dateMilliseconds: startMilliseconds,
        //     amount: 10,
        //     repeatingInterval: 'Monthly',
        //     displayed: true,
        //     planId: firstPlan._id
        // })

        // const rent = new Expense({
        //     description: 'Rent',
        //     date: [startDateArr[0], startDateArr[1] + 6, 1],
        //     dateMilliseconds: startMilliseconds,
        //     amount: 1000,
        //     repeatingInterval: 'Monthly',
        //     displayed: true,
        //     planId: firstPlan._id
        // })
        res.json(user)
    } else {
        res.json(user)
    }




}))



module.exports = router