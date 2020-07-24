var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var sassMiddleware = require('node-sass-middleware');
var logger = require('morgan');
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const BearerStrategy  = require("passport-http-bearer").Strategy;
const passport  =  require("passport")
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var gamesRouter = require('./routes/games');
var contactRouter = require('./routes/contact');
const User = require("./models/users")
var session = require('express-session')
require('dotenv').config()
var app = express();
app.use(bodyParser.json()); 
mongoose.connect(process.env.DB, {
  useNewUrlParser: "true",
  useUnifiedTopology: true,
  useFindAndModify: false
})
mongoose.connection.on("error", err => {
  console.log("err", err)
})
mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected")
})
var sess = {
  secret: 'keyboard cat',
  cookie: {}
}
 
if (process.env.ENV === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
 
app.use(session(sess))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new BearerStrategy(
  function(token, done) {
    User.findOne({ token: token }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'all' });
    });
  }
));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/games', gamesRouter);
app.use('/api/contact', contactRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {title: err.status+ "  -  " + err.message});
});

module.exports = app;
