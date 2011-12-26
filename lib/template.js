/*jshint onevar: false */

var
  util       = require('util'),
  path       = require('path'),
  fs         = require('fs'),
  handlebars = require('handlebars');

// Templates
function getTemplate( filename ) {
  var file = path.resolve( './templates', filename + '.hbs' );
  return fs.readFileSync( file, 'utf8' );
}

module.exports = {};

['index'].forEach(function( tmpl ){
  module.exports[ tmpl ] = handlebars.compile( getTemplate( tmpl ) );
});

