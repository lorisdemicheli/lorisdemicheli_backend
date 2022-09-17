var express = require('express');
var router = express.Router();
let sql = require('../util/sql');

router.put('/:qrCode' , async (req, res) => {
    if (!req.headers.authorization) {
        res.status(403).json({ error: 'No credentials' });
    }
    //TODO mettere header giusta
    const user = await sql.query('SELECT u.* FROM sites_user WHERE u.google_id = ?', [req.headers.cookie]);
    if(user == null || user.length < 1) {
        res.status(403).json({ error: 'User not registered' });
    } 
    await sql.query('INSERT INTO sites_encounters (user_id,user_match_id,creation_date) \
                    (SELECT ?,user_id,now() FROM sites_qr_code WHERE code = ?)',[user[0].id,req.params.qrCode]);
    res.sendStatus(200);
});

router.get('/:username', async (req, res) => {
    const qrQuery = 'SELECT qr.code FROM sites_user u \
                      LEFT JOIN sites_qr_code qr ON qr.user_id = u.id \
                      WHERE u.username = ? \
                      AND date_add(qr.creation_date,interval 5 minute) > now()';
    let sqlRes = await sql.query(qrQuery, [req.params.username]);
    if(sqlRes.length < 1) {
      await sql.query('INSERT INTO sites_qr_code (user_id,creation_date,code) \
                        (SELECT u.id,now(),UUID() FROM sites_user u WHERE u.username = ?)', [req.params.username]);
      sqlRes = await sql.query(qrQuery, [req.params.username]);
    } 
    res.json(sqlRes);
  });

module.exports = router;