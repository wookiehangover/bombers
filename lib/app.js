/*jshint onevar: false */
var
  util = require('util'),
  path = require('path'),
  fs   = require('fs');

var
  strata = require('strata'),
  tmpl   = require('./template');

var
  app    = new strata.Builder(),
  router = new strata.Router();

app.use( strata.commonLogger );
app.use( strata.contentLength );
app.use( strata.contentType );
//app.use( strata.gzip );
app.use( strata.file, path.resolve('./public') );

router.get('*', function( env, callback ){
  callback( 200, {}, tmpl.index({ production: process.env.ENVIRONMENT == "production" ? true : false }) );
});

app.run( router );

module.exports = app;
