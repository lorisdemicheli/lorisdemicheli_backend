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
        res.status(409).json({ 
            error: "User alredy registered",
            status: 409
        });
    }
    await sql.query('INSERT INTO sites_user (username,google_id,url_image,birth_date) VALUES (?,?,?,?)',
        [userDate.username, userDate.googleId, userDate.imgUrl, userDate.birthdate]);
    res.status(200).json({ 
        sucess: "User created",
        status: 200
    })
});

router.post('/login', async (req, res) => {
    const sqlRes = await sql.query('SELECT * FROM sites_user WHERE google_id = ?', [req.body.googleId]);
    if (sqlRes.length < 1) {
        res.status(401).json({ 
            error: "Not registered",
            status: 401
        });
    }

    jwt.sign({ user: sqlRes[0] }, process.env.JWT_KEY, (err, token) => {
        res.status(201).json({
            token,
            username: sqlRes[0].username,
            status: 201
        });
    })
});

router.post('/verify', jwtManager.checkAuthorization, (req, res) => {
    res.status(200).json({ 
        token: req.token, 
        username: req.auth.user.username,
        status: 200
    });
});

module.exports = router;