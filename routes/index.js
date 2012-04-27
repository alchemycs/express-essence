
/*
 * GET home page.
 */

errors = require('../errors');

exports.index = function(req, res){
  res.render('index', { title: 'Express Essence' })
};
