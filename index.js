var express = require('express');
var ejsLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var Hashids = require('hashids');
var db = require('./models');

var app = express();
var hashids = new Hashids("Welcome to the link shortener");

app.set("view engine", "ejs");
app.use(ejsLayouts);
app.use(bodyParser.urlencoded({extended: true}));

// helper function
var hashFunction = function(id) {
  return hashids.encode(id);
};

app.get("/", function(req, res) {
  res.render("index");
});


app.post("/links", function(req, res) {
  // db.link.create({url: req.body.urlToShorten}).then(function(aLink) {
  //   res.redirect("/links/" + aLink.id);
  // });
  db.link.findOrCreate({where:
    {url: req.body.urlToShorten}, defaults: {url: req.body.urlToShorten}}).spread(function(aLink, created) {
    res.redirect("/links/" + aLink.id);
  }).catch(function(error) {
    res.render("404");
  });
});

app.get("/links", function(req, res) {
  // res.render("links");
  db.link.findAll({order: [['clickCount', 'DESC']]}).then(function(links) {
    res.render("links", {orderedLinks: links,
                         hashing: hashFunction});
  });
});

app.get("/:hash", function(req, res) {
  db.link.find({where:
    {id: hashids.decode(req.params.hash)}
  }).then(function(aLink) {
    aLink.clickCount += 1;
    aLink.save();
    res.redirect(aLink.url);
  }).catch(function(error) {
    res.render("404");
  });
});

app.get("/links/:id", function(req, res) {
  db.link.find({where:
      {id: parseInt(req.params.id)}
    }).then(function(aLink) {
    // res.send(aLink.id.toString());
    res.render("show", {link: aLink,
                        hashValue: hashids.encode(aLink.id)});
  }).catch(function(error) {
    res.render("404");
  });
});

app.listen(3000);







