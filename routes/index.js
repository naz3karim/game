var express = require('express');
var router = express.Router();
var passport = require("passport")
var session = require('express-session')

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.isAuthenticated())
  if(req.session.loggedIn){
    res.render('index', { title: 'Checker Game - Home', nav: "nav-auth",name: req.session.name });
  }else{
    res.render('index', { title: 'Checker Game - Home', nav: "nav" });
  }
});
router.get('/game', function(req, res, next) {
  if(req.session.loggedIn){
    res.render('game', { title: 'Checker Game - Play',  nav: "nav-auth",name: req.session.name });
  }else{
    res.redirect("/login")
  }
});
router.get('/login', function(req, res, next) {
  if (req.session.loggedIn){
    res.redirect("/")
  }else{
    res.render('login', { title: 'Login Here',  nav: "nav" });
  }
});
router.get('/contact', function(req, res, next) {
  if (req.session.loggedIn){
    res.render('contact', { title: 'Contact Us',  nav: "nav-auth",name: req.session.name });
  }else{
    res.render('contact', { title: 'Contact Us',  nav: "nav" });
  }
});
router.get('/about', function(req, res, next) {
  if (req.session.loggedIn){
    res.render('about', { title: 'Our Team',  nav: "nav-auth",name: req.session.name });
  }else{
    res.render('about', { title: 'Our Team',  nav: "nav" });
  }
});
router.get('/contact-failure', function(req, res, next) {
  if(req.session.loggedIn){
    res.render('contact-failure', { title: 'Contact Us',  nav: "nav-auth",name: req.session.name }) // Show a page indicating failure
  }else {
    res.render('contact-failure', { title: 'Contact Us',  nav: "nav" }) // Show a page indicating failure
    }
})
router.get('/contact-success', function(req, res, next) {
if(req.session.loggedIn){
    res.render('contact-success', { title: 'Contact Us',  nav: "nav-auth",name: req.session.name }) // Show a page indicating success
  }else {
    res.render('contact-success', { title: 'Contact Us',  nav: "nav" }) // Show a page indicating success
    }
})
router.get('/logout', function(req, res, next) {
  req.session.loggedIn = false;
  res.redirect("/")
});
router.get('/register', function(req, res, next) {
  if(req.session.loggedIn){
    res.redirect("/")
  }else{
  res.render('register', { title: 'Register Here',  nav: "nav" });

  }
});
module.exports = router;
