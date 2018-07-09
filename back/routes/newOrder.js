var express = require('express');
var router = express.Router();
var mysql = require('mysql');


router.post('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  console.log(req.body);
  var session = req.session;
  
  var DBConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '199899',
    database: 'EOSREG'
  });
  DBConnection.connect();
  var addSQL = 'INSERT INTO order_record VALUES ( ?, ?, ?, ?, ?, ?, ?)';
  var addSQLParam = [req.body.txid, req.body.account_name, req.body.apk, req.body.opk, 'unpaid', 'notstart', req.body.email];
  DBConnection.query(addSQL, addSQLParam, function (err, res) {
    if (err) {
      console.log('INSERT ERROR: ', err.message);
      return;
    }
    console.log('INSERT ID: ' + res.toString());
  });
  
  if (session.history === undefined) {
    session.history = [];
  }
  session.history.push({txid: req.body.txid, reg_status: 'notstart', pay_status: 'unpaid', account_name: req.body.account_name});
  console.log(session);
  res.end();
});

module.exports = router;