const dotenv = require('dotenv');
dotenv.config({path: './config/config.env'})
const express = require('express');

const app = express()

app.use(express.json())

app.use('/', (req, res) => {
    res.status(200).send("My API is working")
})

module.exports = app