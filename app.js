const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

// CONNECT TO THE DB
const dotenv = require('dotenv');
dotenv.config({ path: './routes/.env' });
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('############   Connected to the DB...    ###########################'))

var app = express();

// VIEW ENGINE SETUP
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ROUTE MIDDLEWARES
app.use('/api', indexRouter);
app.use('/api/users', usersRouter);

// CATCH 404 AND FORWARD TO ERROR HANDLER
app.use(function(req, res, next) {
  next(createError(404));
});

// ERROR HANDLER
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // RENDER THE ERROR PAGE HERE
  return res.status(err.status || 500).send(err.stack);
  // console.error("=========================ERROR=======================\n"+err.stack);
  // res.render('error', { page: 'Error', menuId: ''});
});

module.exports = app;
