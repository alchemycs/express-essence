
(function() {
    function NotFoundError(msg) {
      this.name = 'NotFoundError';
      Error.call(this, msg);
      Error.captureStackTrace(this, arguments.callee);
      this.render = function(req, res) {
          res.render('not_found', {
            title:"Page Not Found",
            status: 404
          });
      }
    }
        
    NotFoundError.prototype.__proto__ = Error.prototype;    
    
    exports.NotFoundError = NotFoundError;

    function SecureError(msg) {
      this.name = 'SecureError';
      Error.call(this, msg);
      Error.captureStackTrace(this, arguments.callee);
      this.render = function(req, res) {
        res.render('permission_denied', {
          title:"Permission Denied",
          status: 503
        });
      }
    }
    
    SecureError.prototype.__proto__ = Error.prototype;    
    
    exports.SecureError = SecureError;

    function ModuleDisabledError(msg) {
      this.name = 'ModuleDisabledError';
      Error.call(this, msg);
      Error.captureStackTrace(this, arguments.callee);
      this.render = function(req, res) {
        res.render('module_disabled', {
          title:"Module Denied",
          status: 503
        });
      }
    }

    ModuleDisabledError.prototype.__proto__ = Error.prototype;    
    
    exports.ModuleDisabledError = ModuleDisabledError;
    
    function ApplicationUnavailableError(msg) {
      this.name = 'ApplicationUnavailableError';
      Error.call(this, msg);
      Error.captureStackTrace(this, arguments.callee);
      this.render = function(req, res) {
        res.render('application_unavailable', {
          title:"Application Unavailable",
          status: 503
        });
      }
    }
    
    ApplicationUnavailableError.prototype.__proto__ = Error.prototype;    
    
    exports.ApplicationUnavailableError = ApplicationUnavailableError;
    
})();