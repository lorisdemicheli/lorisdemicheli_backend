const express = require('express');
const app = express();
const path = require('path');
const user = require('./routes/user');

app.use(express.static('public'))
app.use(express.json())

app.use('/user', user);

app.listen(process.env.PORT || 3000);

module.exports = app;