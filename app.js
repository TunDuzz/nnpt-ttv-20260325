var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// let mongoose = require('mongoose') removed

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//localhost:3000/users
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/roles', require('./routes/roles'));
app.use('/api/v1/products', require('./routes/products'))
app.use('/api/v1/categories', require('./routes/categories'))
app.use('/api/v1/inventories', require('./routes/inventory'));

const createDatabase = require('./utils/db_create_db');
const sequelize = require('./utils/db');
const Role = require('./models/Role');
const Inventory = require('./models/Inventory');

createDatabase()
  .then(() => {
    return sequelize.authenticate();
  })
  .then(() => {
    console.log("SQL Server connected");
    // Automatically sync models
    return sequelize.sync({ force: false, alter: true });
  })
  .then(async () => {
    console.log("Database synchronized & Tables created");
    // Seed Default Roles if empty
    const count = await Role.count();
    if (count === 0) {
        await Role.create({ name: 'Admin', description: 'Administrator' }); // gets ID 1
        await Role.create({ name: 'User', description: 'Regular User' });   // gets ID 2
        console.log("Default Roles (Admin, User) Seeded");
    }
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
