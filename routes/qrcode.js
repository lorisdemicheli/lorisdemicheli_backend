var express = require('express');
var router = express.Router();
let sql = require('../util/sql');
const jwtManager = require('../manager/jwtManager');

//READ QRCODE
router.put('/:qrCode', jwtManager.checkAuthorization, async (req, res) => {
  let sqlRes = await sql.query('SELECT * FROM sites_qr_code WHERE code = ?', [req.params.qrCode]);
  if(sqlRes.length < 1) {
    res.status(408).json({
      error: "code expired",
      status: 408
    });
  } else if(sqlRes[0].used){
    res.status(408).json({
      error: "code alrady used",
      status: 408
    });
  }
  let sqlRes2 = await sql.query('SELECT u.* FROM sites_user u \
                                LEFT JOIN sites_qr_code qr ON u.id = qr.user_id \
                                LEFT JOIN sites_encounters e ON u.id = e.user_id OR u.id = e.user_match_id \
                                WHERE code = ? AND (e.user_id = ? OR e.user_match_id = ?)', 
                                [req.params.qrCode,req.auth.user.id,req.auth.user.id]);
  if(sqlRes2.length > 0) {
    res.status(408).json({
      error: "alredy matched",
      status: 408
    });
  }
  await sql.query('INSERT INTO sites_encounters (user_id,user_match_id,creation_date) \
                    (SELECT ?,user_id,now() FROM sites_qr_code WHERE code = ?)', [req.auth.user.id, req.params.qrCode]);
  res.status(200).json({
    success: "ok",
    status: 200
  });
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
  res.status(201).json(sqlRes[0]);
});

module.exports = router;