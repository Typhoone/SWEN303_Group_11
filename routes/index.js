var express = require('express');
var router = express.Router();

var pg = require('pg');
var escape = require('pg-escape')

var categories = ["Art", "Beauty", "Books", "Clothing", "Computer", "Electronics", "Footwear", "Furniture", "Gardening", "Health", "Outdoors", "Stationary", "Toys", "Sport", "Other"];

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

router.get('/item', function(request, response){
    pg.connect(DATABASE_URL, function(err, client, done){
        if(err){
            console.error(err);
            response.send("Error " + err);
        }
        else{
            client.query('Select * FROM test_table WHERE name = name', function(err, result){
                done();
                if(err){
                    console.error(err);
                    response.send("Error " + err);
                }
                else{
                    var name = "Super awesome random object";
                    var itemImage = "items";
                    var description = "This is just a lot of informatoin about the object in general, at the moment all of this information is just a placeholder until i can write the rest of it.";
                    response.render('Item', {result:result.rows, name: name, image: itemImage, description: description });
                }
            });
        }
    });
  })


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
          res.render('index', { title: 'Home', email: result.rows[0].email, ID: result.rows[0].id});
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

router.get('/search', function(req, res, next) {
  var term = req.param("term");

  sql = escape("SELECT * FROM items WHERE itemname LIKE '%" + term + "%';");

  pg.connect(DATABASE_URL, function(err, client, done) {
    if (err)
     { console.error(err); res.send("Error " + err); }
    else{
      client.query(sql, function(err, result) {
        done();
        console.log(JSON.stringify(result) + '\n\n\n\n\n\n')

        if (err)
         { console.error(err); res.send("Error " + err); }
        else{
          // console.log('success\n\n\n\n\n\n')
          res.render('browse', { title: term, result:result.rows});
          res.send
        }
      });
    }
  });
})



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Trader' });
});

router.get('/browse', function(req, res, next) {
      pg.connect(DATABASE_URL, function(err, client, done){
        if(err){
            console.error(err);
            res.send("Error " + err);
        }
        else{
            client.query('SELECT * FROM items', function(err, result){
                done();
                if(err){
                    console.error(err);
                    res.send("Error " + err);
                }
                else{
                    res.render('browse', {result: result.rows});
                }
            });
        }
    });
});

router.get('/sell', function(req, res, next) {
  res.render('sell', {title: 'Trader', categories: JSON.stringify(categories)});
});

//run sell query
router.post('/productSubmit', function(req, res, next) {
  userid = req.body.userid;
  name = req.body.name;
  description = req.body.description;
  price = req.body.price;
  quantity = req.body.quantity;
  category = req.body.category;
  //image = req.body.image;

  sql = escape("INSERT INTO items (id, userid, itemname, price, imagename, uploaddate, enddate, stock, description, category) VALUES (default,'" + userid + "','" + name  + "','" + price + "'," + "imagename" + ",'" + "uploaddate" + "','" + "enddate" + ",'" + quantity + ",'" + description + ",'" + category + "');");

  pg.connect(DATABASE_URL, function(err, client, done) {
    if (err)
     { console.error(err); res.send("Error " + err); }
    else{
      client.query(sql, function(err, result) {
        done();
        if (err)
         { console.error(err); res.send("Error " + err); }
        else{
          res.render('sell', {title: 'Trader', categories: JSON.stringify(categories)});
          res.send
        }
      });
    }
  });


});

router.get('/help', function(req, res, next) {
  res.render('help', {title: 'Help!'});
});

module.exports = router;
