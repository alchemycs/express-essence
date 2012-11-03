
(function() {
    
    var crypto = require('crypto');
    
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
    
    var gravatarHash = exports.gravatarHash = function(email) {
        if (email) {
            var md5 = crypto.createHash('md5');
            md5.update(email);
            return md5.digest('hex');
        } else {
            return null;
        }
    }
    
    exports.dynamicHelpers = {
        user:function(req, res) {
            return req.user||null;
        },
        gravatarHash:function(req, res) {
            /* TODO : Consider moving the hash calculation to be part of the Member model */
            if (req.user&&req.user.email) {
                var md5 = crypto.createHash('md5');
                md5.update(req.user.email);
                var hash = md5.digest('hex');
                return hash;
            }
        }
    };
})();