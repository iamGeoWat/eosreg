var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var EOSREG = require('./account-generator');

router.post('/', function(req, res, next) {
  console.log(req.body);
  var txid = req.body.event.data.code;
  
  var DBConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Liuxikai1998',
    database: 'eosreg'
  });
  DBConnection.connect();
  var modSQL = 'UPDATE order_record SET pay_status = ? WHERE txid = ?';
  var modSQLParam = ['ispaid', txid];
  DBConnection.query(modSQL, modSQLParam, function (err, res) {
    if (err) {
      console.log('UPDATE ERROR: ' + err.message);
      return;
    }
    console.log('UPDATE ID: ' + res.toString());
  });
  
  //register account
  var querySQL = 'SELECT * FROM order_record WHERE txid = ' + '\'' + txid + '\'';
  DBConnection.query(querySQL, function (err, result) {
    if (err) {
      console.log('QUERY ERROR: ' + err.message);
      return;
    }
    EOSREG(result[0].account_name, result[0].opk, result[0].apk);
  });

  res.send({status: 200});
  
});

module.exports = router;
