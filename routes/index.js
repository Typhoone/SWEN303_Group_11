var express = require('express');
var router = express.Router();

var pg = require('pg');
var escape = require('pg-escape')
var formidable = require('formidable')
var fs = require('fs-extra')
var crypto = require('crypto'), key = 'thekey'

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

router.get('/item', function(req, res, next) {

    var name = req.param("name");
    var imagename = req.param("imagename");
    var description = req.param("description");
    var stock = req.param("stock");
    res.render('item', { title: 'item', name: name, image: imagename, description: description, stock: JSON.stringify(stock)});
    res.send
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
          res.render('signin', { title: 'Sign In' });
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
          var e = result.rows[0].email;
          var i = result.rows[0].id;
          var f = result.rows[0].first_name;
          client.query('SELECT * FROM items ORDER BY id DESC LIMIT 3', function(err, result){
                done();
                if(err){
                    console.error(err);
                    res.send("Error " + err);
                }
                else{
                    res.render('index', {title: 'Trader', result: result.rows, email: e, ID: i, fname: f, categories: categories});
                    res.send
                }
            });
          /*res.render('index', { title: 'Home', email: e, ID: i, fname: f});
          res.send*/
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

  sql = escape("SELECT * FROM items WHERE LOWER(itemname) LIKE LOWER('%" + term + "%');");

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
  pg.connect(DATABASE_URL, function(err, client, done){
        if(err){
            console.error(err);
            res.send("Error " + err);
        }
        else{
            client.query('SELECT * FROM items ORDER BY id DESC LIMIT 3', function(err, result){
                done();
                if(err){
                    console.error(err);
                    res.send("Error " + err);
                }
                else{
                    res.render('index', {title: 'Trader', result: result.rows, categories: categories});
                }
            });
        }
    });
});

router.get('/browse', function(req, res, next) {
	  var category = req.param("category");
	  var sql;

      pg.connect(DATABASE_URL, function(err, client, done){
        if(err){
            console.error(err);
            res.send("Error " + err);
        }
        else{
        	if (category == null) {
        		sql = "SELECT * FROM items";
        	} else {
				sql = "SELECT * FROM items WHERE category='" + category + "'";
        	}

            client.query(sql, function(err, result){
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
  res.render('sell', {title: 'Trader', categories: categories});
});

//run sell query
router.post('/productSubmit', function(req, res, next) {
  var userid, productName, description, price, quantity, category;
  image = crypto.createHmac('sha1', key).update((new Date()).valueOf().toString()).digest('hex').substring(5, 15);

  new formidable.IncomingForm().parse(req)
    .on('file', function(name, file) {
    	fs.copy(file.path, 'public/images/' + image + ".jpg", function(err) {  
      		if (err) {
        		console.error(err);
        	} else {
        		console.log("Copied successfully");
        	}
    	});
    })
    .on('field', function(name, field) {
    	switch(name) {
	    	case "userid":
	     		userid = field
	        	break;
	    	case "name":
	     		productName = field
	        	break;
	        case "description":
	     		description = field
	        	break;
	        case "price":
	     		price = field
	        	break;
	        case "quantity":
	     		quantity = field
	        	break;
	        case "category":
	     		category = field
	        	break;
	    	default:
	        	break;
		}
    })
    .on('error', function(err) {
        next(err);
    })
    .on('end', function() {
        sql = escape("INSERT INTO items (id, userid, itemname, price, imagename, uploaddate, stock, description, category) VALUES (default,'" + userid + "','" + productName  + "','" + price + "','" + image + "'," + "LOCALTIMESTAMP" + ",'" + quantity + "','" + description + "','" + category + "');");
		console.log(sql);
		pg.connect(DATABASE_URL, function(err, client, done) {
			if (err) { console.error(err); res.send("Error " + err); }
			else {
				client.query(sql, function(err, result) {
					done();
					if (err) { console.error(err); res.send("Error " + err); }
					else {
						res.render('sell', {title: 'Trader', categories: categories});
						res.send
					}
				});
			}
		});
    });
});

router.get('/help', function(req, res, next) {
  res.render('help', {title: 'Help!'});
});

router.post('/purchase', function(req, res, next){

  ID = escape(req.params("ID"));

  sql = "UPDATE items SET stock = stock - 1 WHERE id = '" + ID + "';";

  pg.connect(DATABASE_URL, function(err, client, done) {
    if (err){
      console.error(err); res.send("Error " + err);
    }else{
      client.query(sql, function(err, result) {
        done();
        //update table
        if (err)
         { console.error(err); res.send("Error " + err); }
      });//end first query

      //check if empty
      sql = "SELECT * FROM items WHERE id = '" + ID + "';";

      client.query(sql, function(err, result) {
        done();
        if (err){
          console.error(err); res.send("Error " + err);
        }else{
          if(result.rows[0].stock < 1){
            sql = "DELETE FROM items WHERE id = '" + ID + "';";
            client.query(sql, function(err, result){
              if (err)
               { console.error(err); res.send("Error " + err); }
            });
          }
        }
      });
  };// end first connect
  res.render('browse', {title: 'Browse', success : true});
  res.send
});//end post


})

module.exports = router;
