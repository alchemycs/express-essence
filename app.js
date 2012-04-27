
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , swig = require('swig')
  , errors = require('./errors')
  , tools = require('./tools')
  ;

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
  app.set('view engine', viewEngine);
  app.set('view options', { layout: false });
  app.use(express.logger());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'JpchuJ9sPR6LJ3KWPJZZ0HU6hWLEQsWgm17MxcMHmpw=' }));
  app.use(tools.enablechromeframe);
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(function(req, res) {
      throw new errors.NotFoundError();
  });
  app.error(function(err, req, res, next) {
      if (err.render) {
          err.render(req, res);
      } else {
          next(err);
      }
  });
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

app.listen(process.env.PORT || 3030);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
