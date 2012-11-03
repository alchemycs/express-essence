"use strict";

var tools = require('./index');
var errors = require('../errors');

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the BrowserID verified email address
//   is serialized and deserialized.
exports.serializeUser = function(user, callback) {
    callback(null, user.email);
};

exports.deserializeUser = function(email, callback) {
    callback(null, { email: email, gravatarHash:tools.gravatarHash(email) });
};

exports.validateUser = function(email, callback) {
    //For this example we verify asynchronously for effect...
    process.nextTick(function() {
      // To keep the example simple, the user's email address is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the email address with a user record in your database, and
      // return that user instead.
        callback(null, { email: email, gravatarHash:tools.gravatarHash(email) });
    });
};

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
exports.ensureAuthenticated = function(req, res, next) {
    console.log('Ensuring authentication');
    if (req.isAuthenticated()) { 
        return next(); 
    }
    next(new errors.UnauthorizedError());
}
