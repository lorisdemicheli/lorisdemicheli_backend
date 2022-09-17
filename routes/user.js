var express = require('express');
var router = express.Router();
let sql = require('../util/sql');


router.get('/:username', async (req, res) => {
  let sqlRes = await sql.query('SELECT * FROM sites_user WHERE username = ?', [req.params.username]);
  res.json(sqlRes);
});

router.get('/:username/match', async (req, res) => {
  let sqlRes = await sql.query('SELECT m.username,m.url_image,m.birth_date,r.color_code \
                                FROM sites_user u \
                                LEFT JOIN sites_encounters e ON e.user_id = u.id OR e.user_match_id = u.id \
                                LEFT JOIN sites_user m ON m.id = if(u.id = e.user_id, e.user_match_id, e.user_id) \
                                LEFT JOIN sites_rarity r ON r.strength = (SELECT MAX(ri.strength) FROM sites_rarity ri \
																			WHERE ri.strength <= (SELECT COUNT(me.id) FROM sites_encounters me \
																				WHERE me.user_id = m.id OR me.user_match_id = m.id)) \
                                WHERE u.username = ?', [req.params.username]);
  res.json(sqlRes);
});





module.exports = router;