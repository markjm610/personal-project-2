const express = require('express');

const User = require('../models/user')


const router = express.Router();

const asyncHandler = handler => (req, res, next) => handler(req, res, next).catch(next);

router.post('/users', asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    const newUser = new User({ name, email })

    newUser.save()

    res.json(newUser)

}))

module.exports = router