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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  res.send();
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
                    response.render('item', {result:result.rows, name: name, image: itemImage, description: description });
                }
            });
        }
    });
})

/*
router.get('/item', function(req, res, next){
    res.render('item')
});

*/

router.get('/test', function(req, res, next) {
    res.render('test', { title: 'Express' });
});

module.exports = router;

