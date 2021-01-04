const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
// const bodyParser = require('body-parser')



const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false },);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Connected to MongoDB')
})

app = express();

app.use(express.json());
app.use(cors({ origin: true }));
// app.use(bodyParser({ limit: '50mb' }))



const usersRouter = require('./routes/users');
const plansRouter = require('./routes/plans');
const salariesRouter = require('./routes/salaries');
const expensesRouter = require('./routes/expenses');
app.use(usersRouter)
app.use(plansRouter)
app.use(salariesRouter)
app.use(expensesRouter)



app.use(express.static(path.join(__dirname, '/../front-end/build')));


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../front-end/build/index.html'));
});



const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})