const express = require('express');
const Plan = require('../models/plan');

const router = express.Router();

const asyncHandler = handler => (req, res, next) => handler(req, res, next).catch(next);

router.post('/plans', asyncHandler(async (req, res) => {
    const { name, startDate } = req.body;

    const newPlan = new Plan({ name, startDate })
    newPlan.save()
    res.json('Plan saved')

}))

router.get('/users/:userId/plans', asyncHandler(async (req, res) => {


}))

module.exports = router;