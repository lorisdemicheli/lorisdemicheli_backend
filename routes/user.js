var express = require('express');
var router = express.Router();
let sql = require('../util/sql');


router.get('/:userId', async (req, res) => {
  let sqlRes = await sql.query('SELECT * FROM sites_user WHERE username = ?', [req.params.userId]);
  res.json(sqlRes);
});

router.get('/:userId/match', async (req, res) => {
  let sqlRes = await sql.query('SELECT m.* FROM sites_user u \
                                LEFT JOIN sites_encounters e ON e.user_id = u.id OR e.user_match_id = u.id \
                                LEFT JOIN sites_user m ON m.id = if(u.id = e.user_id, e.user_match_id, e.user_id)\
                                WHERE u.username = ?', [req.params.userId]);
  res.json(sqlRes);
});

router.get('/:userId/qrcode', async (req, res) => {
  const qrQuery = 'SELECT qr.code FROM sites_user u \
                    LEFT JOIN sites_qr_code qr ON qr.user_id = u.id\
                    WHERE u.username = ? \
                    AND date_add(qr.creation_date,interval 5 minute) > now()';
  let sqlRes = await sql.query(qrQuery, [req.params.userId]);
  if(sqlRes.length < 1) {
    await sql.query('INSERT INTO sites_qr_code (user_id,creation_date,code) \
                      (SELECT u.id,now(),UUID() FROM sites_user u WHERE u.username = ?)', [req.params.userId]);
    sqlRes = await sql.query(qrQuery, [req.params.userId]);
  } 
  res.json(sqlRes);
});

module.exports = router;