// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');
// generate a new express app and call it 'app'
var app = express();
var db = require('./models');
var bodyParser = require('body-parser');

app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: true}));

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  //res.sendFile(__dirname + '/views/index.html');
  db.Album.find({}, function(err, data){
    if (err){ res.json({message: "Error: ", err}) }
      res.render('index', {albums: data});
  });
});


/*
 * JSON API Endpoints
 */

app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

app.get('/api/albums', function album_index(req, res){
  db.Album.find({}, function(err, albums){
    res.json( albums );
  })
});

app.post('/api/albums', function(req, res){
  db.Album.create({name: req.body.name, artistName: req.body.artistName, releaseDate: req.body.releaseDate, genres: req.body.genres},
    function(error, albums){
      res.redirect("/");
    });
})

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
