const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// const MongoClient = require('mongodb').MongoClient;
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//     const collection = client.db("test").collection("devices");
//     // perform actions on the collection object
//     client.close();
// });

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true },);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Connected to MongoDB')
})

app = express();


app.use(express.json());
app.use(cors({ origin: true }));

const usersRouter = require('./routes/users');

app.use(usersRouter)

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Listening on ${port}`)
})