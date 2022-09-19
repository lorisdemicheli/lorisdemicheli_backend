const express = require('express');
const router = express.Router();
let sql = require('../util/sql');
require('dotenv').config();
const jwtManager = require('../manager/jwtManager');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const userDate = {
        username: req.body.username,
        googleId: req.body.googleId,
        imgUrl: req.body.imgUrl,
        birthdate: req.body.birthdate
    }
    const sqlRes = await sql.query('SELECT * FROM sites_user WHERE google_id = ?', [userDate.googleId]);
    if (sqlRes.length > 1) {
        res.status(409).json({ error: "User alredy registered" });
    }
    await sql.query('INSERT INTO sites_user (username,google_id,url_image,birth_date) VALUES (?,?,?,?)',
        [userDate.username, userDate.googleId, userDate.imgUrl, userDate.birthdate]);
    res.status(200).json({ sucess: "User created" })
});

router.post('/login', async (req, res) => {
    const sqlRes = await sql.query('SELECT * FROM sites_user WHERE google_id = ?', [req.body.googleId]);
    if (sqlRes.length < 1) {
        res.status(401).json({ error: "Not registered" });
    }

    jwt.sign({ user: sqlRes[0] }, process.env.JWT_KEY, (err, token) => {
        res.status(201).json({
            token,
            username: sqlRes[0].username
        });
    })
});

router.post('/verify', jwtManager.checkAuthorization, (req, res) => {
    res.sendStatus(200);
});

module.exports = router;