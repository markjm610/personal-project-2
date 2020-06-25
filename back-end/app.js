const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Connected to MongoDB')
})

app = express();

app.use(express.json());
app.use(cors({ origin: true }));

const usersRouter = require('./routes/users');
const plansRouter = require('./routes/plans');
const salariesRouter = require('./routes/salaries');
const expensesRouter = require('./routes/expenses');
app.use(usersRouter)
app.use(plansRouter)
app.use(salariesRouter)
app.use(expensesRouter)

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})