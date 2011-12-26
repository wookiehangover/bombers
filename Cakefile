# Dependencies

fs      = require('fs')
{_}     = require('underscore')
path    = require('path')
tmpl    = require('handlebars-jst')
{log}   = require('util')
stitch  = require('stitch')
uglify  = require('uglify-js')

# Configuration

APP_PATH  = path.resolve('./app')
LIB_PATH  = path.resolve('./public/assets/js/libs')
SRC_DIR   = 'public/assets/js/src'
VIEWS_DIR = 'app/views'

# Helpers for minifying with [uglify](https://github.com/mishoo/UglifyJS) and
# building with [Stitch](https://github.com/sstephenson/stitch)

uglyStick = ( file, minfile, no_squeeze ) ->
  jsp = uglify.parser
  pro = uglify.uglify

  fs.readFile file, 'utf8', (err, fileContents) ->
    ast = jsp.parse fileContents  # parse code and get the initial AST
    ast = pro.ast_mangle ast      # get a new AST with mangled names
    unless no_squeeze
      ast = pro.ast_squeeze ast
    final_code = pro.gen_code ast # compressed code here

    fs.writeFile minfile, final_code

    log "Uglified #{minfile}"

sew = ( filename, paths, deps ) ->
  pkg = stitch.createPackage( paths: paths, dependencies: deps || [] )

  pkg.compile ( err, src ) ->
    fs.writeFile filename, src, ( err ) ->
      throw err if err
      log "Compiled #{filename}"
      uglyStick filename, filename.replace(/\.js/, '.min.js')

# Build Tasks

task 'build', 'create minified application, libraries and templates files', ->
  invoke 'build:app'
  invoke 'build:libs'
  invoke 'build:templates'

task 'build:app', 'concat application with Stitch', ->
  root  = APP_PATH
  paths = [ root ]

  sew "#{SRC_DIR}/app.js", paths

task 'build:libs', 'concat all external libs with Stitch',->
  root  = LIB_PATH
  paths = [ root ]
  deps  = [
    "#{root}/underscore.js"
    "#{root}/handlebars.1.0.0.beta.2.js"
    "#{root}/backbone.js"
    "#{root}/transformjs.1.0.beta.2.js"
    "#{root}/jquery.easing.1.3.js"
  ]

  sew "#{SRC_DIR}/libs.js", paths, deps

task 'build:templates', 'compile all Handlebars templates', ->
  filename = "#{SRC_DIR}/templates.js"

  tmpl.build VIEWS_DIR, ( data ) ->
    tmpl.process data, SRC_DIR, ->
      uglyStick( filename, filename.replace(/\.js/, '.min.js'), true )

# Watch Tasks

task 'watch', 'run appropriate build whenever app or template files change', ->
  root  = APP_PATH
  files = fs.readdirSync( root )
  dirs  = [ root ]

  for f in files
    if fs.statSync("#{root}/#{f}").isDirectory() is true
      dirs.push("#{root}/#{f}")

  for d in dirs then do (d) ->
    handler = (event, filename) ->
      if /views/.test( d )
        invoke 'build:templates'
      else
        invoke 'build:app'

    fs.watch( d, _.throttle( handler, 50 ) )
