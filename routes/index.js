var express = require('express');
var router = express.Router();

var pg = require('pg');
var escape = require('pg-escape')

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
});

//Load signup page
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Register' });
  res.send
});
//run signup query
router.post('/signupSubmit', function(req, res, next) {
  email = req.body.email;
  pass = req.body.pass;
  fname = req.body.fname;
  lname = req.body.lname;
  phone = req.body.phone;
  addr = req.body.addr;

  sql = escape("INSERT INTO users (id, email, first_name, last_name, phone, address, pass) VALUES (default,'" + email + "','" + fname  + "','" + lname + "'," + phone + ",'" + addr + "','" + pass + "');");

  pg.connect(DATABASE_URL, function(err, client, done) {
    if (err)
     { console.error(err); res.send("Error " + err); }
    else{
      client.query(sql, function(err, result) {
        done();
        if (err)
         { console.error(err); res.send("Error " + err); }
        else{
          res.render('signup', { title: 'Register' });
          res.send
        }
      });
    }
  });


});

router.post('/signInSubmit', function(req, res, next) {
  email = req.body.email;
  pass = req.body.pass;

  sql = escape("SELECT * FROM users WHERE email='" + email + "';");

  pg.connect(DATABASE_URL, function(err, client, done) {
    if (err)
     { console.error(err); res.send("Error " + err); }
    else{
      client.query(sql, function(err, result) {
        done();
        console.log(JSON.stringify(result) + '\n\n\n\n\n\n')

        if (err)
         { console.error(err); res.send("Error " + err); }
        else if (result == 'undefined' || result.rows.length === 0) {
          // console.log('invalid email\n\n\n\n\n\n')
          res.render('signin', { title: 'Sign In', err: 'Invlaid Email'})
        }else if (result.rows[0].pass === 'undefined' || result.rows[0].pass !== pass) {
          // console.log('invalid pass\nThey gave: ' + pass + '\nBut was: ' + result.rows[0].pass + '\n\n\n\n')
          res.render('signin', { title: 'Sign In', err: 'Invlaid Password'})
        }
        else{
          // console.log('success\n\n\n\n\n\n')
          res.render('index', { title: 'Sign In', email: result.rows[0].email, ID: result.rows[0].id});
          res.send
        }
      });
    }
  });
});

router.get('/signin', function(req, res, next) {
  res.render('signin', { title: 'Sign In' });
  res.send
});

router.get('/sell', function(req, res, next) {
  res.render('sell', { title: 'Sell' });
  res.send
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Trader' });
});

router.get('/Browse', function(req, res, next) {
  res.render('browse', {title: 'Trader'});
});

router.get('/Sell', function(req, res, next) {
  res.render('sell', {title: 'Trader'});
});

router.get('/Help', function(req, res, next) {
  res.render('help', {title: 'Trader'});
});

module.exports = router;
