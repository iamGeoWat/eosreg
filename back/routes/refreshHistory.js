var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var async = require('async');

router.post('/', function(req, res, next) {
  console.log(req.session);
  if (req.session.signed) {
    var DBConnection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Liuxikai1998',
      database: 'eosreg'
    });
    DBConnection.connect();
    async.each(req.session.history, function (item, callback) {
      console.log(item);
      var querySQL = 'SELECT * FROM order_record WHERE txid = ' + '\'' + item.txid + '\'';
      DBConnection.query(querySQL , (err, result) => {
        if (err) {
          console.log('QUERY ERROR: ' + err.message);
        }
        if (result[0] !== undefined) {
          console.log(result);
          console.log('query done');
          console.log(result[0].pay_status);
          item.pay_status = result[0].pay_status;
          console.log(result[0].reg_status);
          item.reg_status = result[0].reg_status;
        } else {
          console.log('no such txid.');
        }
        callback();
      })
    }, function () {
      console.log('foreach done');
      res.send({
        history: req.session.history
      });
    });
  } else {
    req.session.signed = true;
    console.log('renewed sign in status')
    res.end();
  }
  
});

module.exports = router;