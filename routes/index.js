
/*
 * GET home page.
 */

exceptions = require('../errors');

exports.index = function(req, res){
  res.render('index', { title: 'Express' })
};
