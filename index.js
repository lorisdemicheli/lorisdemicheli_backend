const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const user = require('./routes/user');
const qrcode = require('./routes/qrcode');
const auth = require('./routes/auth');
const cors = require('cors')

app.use(cors({origin: ['http://localhost:4200','https://lorisdemicheli-github-io.vercel.app/']}))

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json())

app.use('/auth', auth);
app.use('/user', user);
app.use('/qr', qrcode);

app.listen(process.env.PORT || 3000);

module.exports = app;