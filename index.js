const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const user = require('./routes/user');
const qrcode = require('./routes/qrcode');
const auth = require('./routes/auth');
const cors = require('cors');
require('dotenv').config();

let corsOptions = {}
if(process.env.ENVIROMENT == 'test') {
    corsOptions = {
        origin: 'http://localhost:4200'
    }
} else {
    corsOptions = {
        origin: 'https://lorisdemicheli-github-io.vercel.app'
    }
}
app.use(cors(corsOptions))

app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.json())
app.use(express.json())

app.use('/auth', auth);
app.use('/user', user);
app.use('/qr', qrcode);

app.listen(process.env.PORT || 3000);

module.exports = app;