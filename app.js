var http = require('http');
var express = require('express');
var useragent = require('express-useragent');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require("config");
//var lessMiddleware = require('less-middleware');
var auth = require("./auth");
var data = require("./data");
var socket = require("./socket");
var routes = require('./routes/index');
var login = require('./routes/login');
var main = require('./routes/main');
var images = require('./routes/image');
var items = require("./routes/item");
var categories = require("./routes/category");
var location = require("./routes/location");
var bid = require("./routes/bid");
var facebook = require("./routes/facebook");
var conversation =  require("./routes/conversation");



var app = express();
var server = http.createServer(app);

var port = parseInt(process.env.PORT, 10) || 7011;
app.set('port', port);


server.listen(port);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use('*',function(req,res,next){
	if(process.env.NODE_ENV == "dev"){
		next();
		return;
	}

	if(req.headers['x-forwarded-proto'] != config.forceDomain.protocol)
		res.redirect(config.forceDomain.protocol + "://" + config.forceDomain.domain + req.url);
	else
		next(); /* Continue to other routes if we're not redirecting */
});

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(useragent.express());
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/lib', express.static(__dirname + '/public/lib'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/fonts', express.static(__dirname + '/public/fonts'));
app.use('/html', express.static(__dirname + '/public/html/'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/favicon.ico', express.static(__dirname + '/public/favicon.ico'));
app.use(session({
	name: 'billionsofbids',
	secret: 'bean burrito',
	resave: false,
	saveUninitialized: true
}));

data.init();
auth.init(app);

app.use('/', routes);
app.use('/login', login);
app.use('/main', main);
app.use('/image', images);
app.use('/item', items);
app.use('/category', categories);
app.use('/location', location);
app.use('/bid', bid);
app.use('/facebook', facebook);
app.use('/conversation', conversation);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

socket.init(server, port);


module.exports = app;
