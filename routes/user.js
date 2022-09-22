var express = require('express');
var router = express.Router();
let sql = require('../util/sql');
const image = require('../services/image');
const jwtManager = require('../manager/jwtManager');

router.get('/:username', async (req, res) => {
  let sqlRes = await sql.query('SELECT * FROM sites_user WHERE username = ?', [req.params.username]);
  res.json(sqlRes);
});

router.get('/:username/match', async (req, res) => {
  let sqlRes = await sql.query('SELECT m.username,m.url_image as img,m.birth_date as birthdate,r.color_code as colorCode, "" as description \
                                FROM sites_user u \
                                LEFT JOIN sites_encounters e ON e.user_id = u.id OR e.user_match_id = u.id \
                                LEFT JOIN sites_user m ON m.id = if(u.id = e.user_id, e.user_match_id, e.user_id) \
                                LEFT JOIN sites_rarity r ON r.strength = (SELECT MAX(ri.strength) FROM sites_rarity ri \
																			WHERE ri.strength <= (SELECT COUNT(me.id) FROM sites_encounters me \
																				WHERE me.user_id = m.id OR me.user_match_id = m.id)) \
                                WHERE u.username = ?', [req.params.username]);
  res.status(200).json({
    cards: sqlRes,
    status: 200
  });
});

router.put('/image/add', jwtManager.checkAuthorization, async (req, res) => {
  console.log(req.body.image)
  console.log(req.body.imageName)
  image.uploadImage(req.body.image, req.body.imageName, async (result, error) => {
    //TODO result get url
    await sql.query('UPDATE sites_user SET url_image = ? WHERE id = ?', [result.urlImage, req.auth.user.id]);
    res.status(200).json({ 
      success: "uploaded image",
      status: 200 
    });
  });
});

module.exports = router;