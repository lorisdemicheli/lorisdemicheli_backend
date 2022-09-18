var express = require('express');
var router = express.Router();
let sql = require('../util/sql');
const jwtManager = require('../manager/jwtManager');

//READ QRCODE
router.put('/:qrCode', jwtManager.checkAuthorization, async (req, res) => {
  await sql.query('INSERT INTO sites_encounters (user_id,user_match_id,creation_date) \
                    (SELECT ?,user_id,now() FROM sites_qr_code WHERE code = ?)', [req.auth.user.id, req.params.qrCode]);
  res.sendStatus(200);
});

router.post('/generate', jwtManager.checkAuthorization, async (req, res) => {
  const qrQuery = 'SELECT qr.code FROM sites_user u \
                      LEFT JOIN sites_qr_code qr ON qr.user_id = u.id \
                      WHERE u.id = ? \
                      AND date_add(qr.creation_date,interval 5 minute) > now()';
  let sqlRes = await sql.query(qrQuery, [req.auth.user.id]);
  if (sqlRes.length < 1) {
    await sql.query('INSERT INTO sites_qr_code (user_id,creation_date,code) \
                      (SELECT u.id,now(),UUID() FROM sites_user u WHERE u.id = ?)', [req.auth.user.id]);
    sqlRes = await sql.query(qrQuery, [req.auth.user.id]);
  }
  res.status(201).json(sqlRes);
});

module.exports = router;