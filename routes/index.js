var express = require('express');
var router = express.Router();

var pg = require('pg');

DATABASE_URL = "postgres://qczjndeqrgzuke:hwrYaoDiY6dy81EZElhbrrwNGm@ec2-54-227-240-164.compute-1.amazonaws.com:5432/da1pqqn7h9sfln";

pg.defaults.ssl = true;
router.get('/db', function (request, response) {
  pg.connect(DATABASE_URL, function(err, client, done) {
    if (err)
     { console.error(err); response.send("Error " + err); }
    else{
      client.query('SELECT * FROM test_table', function(err, result) {
        done();
        if (err)
         { console.error(err); response.send("Error " + err); }
        else
         { response.render('db', {results: result.rows} ); }
      });
    }
  });
})

router.get('/sell', function(req, res, next) {
  res.render('sell', { title: 'Sell' });
  res.send
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  res.send
});

module.exports = router;
