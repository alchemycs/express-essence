
(function() {
    
    exports.enablechromeframe = function(req, res, next) {
      res.header('X-UA-Compatible', 'chrome=1'); //Make sure Google Chrome Frame gets activate
      next();
    };
    
    exports.errorhandler = function(err, req, res, next) {
      if (err.render) {
          err.render(req, res);
      } else {
          next(err);
      }
    };
})();