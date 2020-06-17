const express = require('express');

const router = express.Router();

const asyncHandler = handler => (req, res, next) => handler(req, res, next).catch(next);

router.post('/plans', asyncHandler(async (req, res) => {
    const { }

    res.json()

}))

router.get('/users/:userId/plans', asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId, 10);



    res.json()

}))