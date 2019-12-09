var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyparser = require('body-parser');

var indexRouter = require('./routes/index.routes');
var usersRouter = require('./routes/users.routes');
var AdminRouter = require('./routes/admin.routes');
var EventRouter = require('./routes/event.routes');
var UserEventsRouter = require('./routes/user.events.routes');







var cors = require('cors');

const passport = require('passport');




var app = express();

require('./_helpers/db');

app.use(cors());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyparser.urlencoded({ extended: false }));



require('./auth/auth');
app.use(bodyparser.urlencoded({ extended: false }));


app.use('/', indexRouter);

app.use('/users', /*passport.authenticate('jwt', { session: false }),*/ usersRouter);
app.use('/admins', passport.authenticate('jwt', { session: false }), AdminRouter);
app.use('/events', passport.authenticate('jwt', { session: false }), EventRouter);






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