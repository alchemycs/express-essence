
(function() {
    
    exports.enablechromeframe = function(req, res, next) {
      res.header('X-UA-Compatible', 'chrome=1'); //Make sure Google Chrome Frame gets activate
      next();
    };
    
})();