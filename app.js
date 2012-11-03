
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , swig = require('swig')
  , errors = require('./errors')
  , tools = require('./tools')
  , passport = require('passport')
  , util = require('util')
  , BrowserIDStrategy = require('passport-browserid').Strategy  
  , authentication = require('./tools/authentication');
  ;

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the BrowserID verified email address
//   is serialized and deserialized.
passport.serializeUser(authentication.serializeUser);
passport.deserializeUser(authentication.deserializeUser);

// Use the BrowserIDStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, a BrowserID verified email address), and invoke
//   a callback with a user object.
passport.use(new BrowserIDStrategy({
    audience: 'http://express-essence.alchemycs.c9.io'
  }, authentication.validateUser)
);

var app = module.exports = express.createServer();

var viewEngine = 'html';
// Configuration
app.configure(function(){
  app.register('.html', swig);
  app.set('views', __dirname + '/views');
  swig.init({
      root:app.settings.views,
      allowErrors: true,
      cache:false
  });
  
  app.dynamicHelpers(tools.dynamicHelpers);
  
  app.set('view engine', viewEngine);
  app.set('view options', { layout: false });
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'JpchuJ9sPR6LJ3KWPJZZ0HU6hWLEQsWgm17MxcMHmpw=' }));
  app.use(tools.enablechromeframe);
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(function(req, res) {
      throw new errors.NotFoundError();
  });
  app.error(tools.errorhandler);
});

app.configure('development', function(){
  //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.set('is_testenv', true);
});

app.configure('production', function(){
  //app.use(express.errorHandler());
  app.set('is_testenv', false);
});

// Routes

app.get('/', routes.index);

app.get('/account', authentication.ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/auth/whoami', function(req, res, next) {
        res.header('Cache-Control', 'no-cache');
    if (req.user) {
        res.json(req.user, 200);
    } else {
//        res.json({ email:'bob@example.com'}, 200);
        res.json('', 204);
    }
});

// POST /auth/login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  BrowserID authentication will verify the assertion obtained from
//   the browser via the JavaScript API.
app.post('/auth/login', function(req, res, next) {
    passport.authenticate('browserid', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            //Login failed
            return res.json(info, 400);
        }
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.json(user, 200);
        });
    })(req, res, next);
});

app.all('/auth/logout', function(req, res) {
    req.logout();
    res.json('', 204);
});

app.listen(process.env.PORT || 3030);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
