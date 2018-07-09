var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res, next) {
  console.log(req.session);
  
  res.sendFile(path.join(__dirname, '../views/index.html'));
  // res.end();
  console.log('get / ended');
});

module.exports = router;
