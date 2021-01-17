var express = require('express');
var router = express.Router();

/* GET create session ID. */
router.get('/', function(req, res, next) {
  res.send('ID');
});

module.exports = router;
