const express = require('express');

const User = require('../models/user')


const router = express.Router();

const asyncHandler = handler => (req, res, next) => handler(req, res, next).catch(next);

router.post('/users', asyncHandler(async (req, res) => {
    const { name, email } = req.body;

    let user = await User.findOne({ email })

    if (!user) {
        user = new User({ name, email })
        await user.save()
    }

    res.json(user)

}))

module.exports = router