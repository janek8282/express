var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var newsRouter = require('./routes/news');
var quizRouter = require('./routes/quiz');
var adminRouter = require('./routes/admin');
const { closeSync } = require('fs');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// funkcja która przechwytuje adres url od klienta i przekazuje go dalej do widoków
// funkcja posiada dodatkowo parametr 'next' który umoiżliwia przejście do kolenych routingów poniżej, nie zatrzymuje programu
app.use((req, res, next) => {
  // przekazujemy ścieżkę 'req.path' do zmiannej lokalnej 'res.locals.nazwaZmiennej'
  // dzięki temu będziemy mieli do tej zmiennej dostęp w widokach
  res.locals.sciezka = req.path;
  next();
});

app.use('/', indexRouter);
app.use('/news', newsRouter);
app.use('/quiz', quizRouter);
app.use('/admin', adminRouter);


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
  res.render('error');
});

module.exports = app;
