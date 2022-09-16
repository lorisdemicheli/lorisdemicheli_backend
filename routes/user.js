var express = require('express');
var router = express.Router();
let sql = require('../util/sql');


router.get('/:userId', async (req, res) => {
  let sop = await sql.query('SELECT * FROM sites_user WHERE username = ?', [req.params.userId]);
  res.json(sop);
});

module.exports = router;