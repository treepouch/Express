var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
const { check, validationResult } = require('express-validator/check');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var aboutRouter = require('./routes/about');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.locals.name = "Peter";
app.use((req, res, next) => {

    res.locals.errors = null;
    next();

});

app.use(expressValidator());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/about', aboutRouter);
app.post('/users/add', [
    // ...some other validations...
    check('email').isEmail().withMessage('must have email format'),
    check('firstname').isLength({ min: 2 }).withMessage('must have at least 2 letters'),
    check('lastname').isLength({ min: 2 }).withMessage('must have at least 2 letters')
], (req, res) => {


    var errors = validationResult(req);
    var errorsArray;
    var namesdata = require("./names.json");
    if (!errors.isEmpty()) {
        errorsArray = errors.array();
        console.log("errors", errorsArray);
       res.render('index', { title: 'Express', namesdata: namesdata, errors: errorsArray});
        //return res.status(422).json({ errors: errors.array() });
    }
    else {
        var user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email


        }

        console.log("firstname", user.firstname);

        console.log("lastname", user.lastname);
        console.log("email", user.email);
        res.render('index', { title: 'Express', namesdata: namesdata});
    }
})
;

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
