var EOS = require('eosjs');
var fs = require('fs');
var path = require('path');
var mysql = require('mysql');

function eosreg(account_name, opk, apk) {
  console.log('creation started.');
  console.log('account name: ' + account_name + ' opk: ' + opk + ' apk: ' + apk);
  
  var httpEndpoint = 'https://publicapi-mainnet.eosauthority.com';
  var chainId = 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906';
  
  var creator = 'eosbegincomm';

  // let accountName = account_name;
  // let opk = opk;
  // let apk = apk;
  
  var secret = fs.readFileSync(path.join(__dirname, '/key.txt'), {encoding: 'utf8'});
  var keyProvider = [secret];
  console.log(keyProvider);

  eos = EOS({httpEndpoint, chainId, keyProvider});
  eos.transaction(tr => {
    tr.newaccount({
      creator: creator,
      name: account_name,
      owner: opk,
      active: apk
    });
    tr.buyrambytes({
      payer: creator,
      receiver: account_name,
      bytes: 4096
    });
    tr.delegatebw({
      from: creator,
      receiver: account_name,
      stake_net_quantity: '0.1000 EOS',
      stake_cpu_quantity: '0.1000 EOS',
      transfer: 1
    })
  }).then((data) => {
    console.log(data.transaction_id);
    var DBConnection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Liuxikai1998',
      database: 'eosreg'
    });
    DBConnection.connect();
    var modSQL = 'UPDATE order_record SET reg_status = ? WHERE account_name = ?';
    var modSQLParam = ['regdone', account_name];
    DBConnection.query(modSQL, modSQLParam, function (err, res) {
      if (err) {
        console.log('UPDATE ERROR: ' + err.message);
        return;
      }
      console.log('UPDATE ID: ' + res.toString());
    });
  }).catch((e) => {
    var error = JSON.stringify(e);
    console.log("ERROR: " + error);
  });
}

module.exports = eosreg;