var
  strata = require('strata'),
  app = require('./app');

strata.run( app, { port: process.env.PORT || 9001 } );
