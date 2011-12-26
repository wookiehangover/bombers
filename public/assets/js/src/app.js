
(function(/*! Stitch !*/) {
  if (!this.require) {
    var modules = {}, cache = {}, require = function(name, root) {
      var module = cache[name], path = expand(root, name), fn;
      if (module) {
        return module;
      } else if (fn = modules[path] || modules[path = expand(path, './index')]) {
        module = {id: name, exports: {}};
        try {
          cache[name] = module.exports;
          fn(module.exports, function(name) {
            return require(name, dirname(path));
          }, module);
          return cache[name] = module.exports;
        } catch (err) {
          delete cache[name];
          throw err;
        }
      } else {
        throw 'module \'' + name + '\' not found';
      }
    }, expand = function(root, name) {
      var results = [], parts, part;
      if (/^\.\.?(\/|$)/.test(name)) {
        parts = [root, name].join('/').split('/');
      } else {
        parts = name.split('/');
      }
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part == '..') {
          results.pop();
        } else if (part != '.' && part != '') {
          results.push(part);
        }
      }
      return results.join('/');
    }, dirname = function(path) {
      return path.split('/').slice(0, -1).join('/');
    };
    this.require = function(name) {
      return require(name, '');
    }
    this.require.define = function(bundle) {
      for (var key in bundle)
        modules[key] = bundle[key];
    };
  }
  return this.require.define;
}).call(this)({"index": function(exports, require, module) {/*jshint onevar: false*/
/*global Backbone, $ */
var Bombers = require('lib/bombers');

Bombers.init = function(){

  var app = Bombers.app;

  var Router = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    index: function() {
      $('html,body').animate({ scrollTop: 0 }, 100);
    }
  });

  app.router = new Router();

  app.view = new Bombers.Views.App();



  $(document).delegate("a", "click", function(evt) {
    // Get the anchor href and protcol
    var
      href = $(this).attr("href"),
      protocol = this.protocol + "//";

    // Ensure the protocol is not part of URL, meaning its relative.
    if (href.slice(protocol.length) !== protocol) {
      evt.preventDefault();

      app.router.navigate(href, true);
    }
  });

  Backbone.history.start({ pushState: true });
};

jQuery(function(){
  Bombers.init();
});
}, "lib/bombers": function(exports, require, module) {/*global Backbone*/
var App = require('modules/app');

this.Bombers = {
  Models: {},
  Collections: {},
  Views: {
    App: App
  },
  app: _.extend({}, Backbone.Events)
};

module.exports = this.Bombers;
}, "modules/app": function(exports, require, module) {/*global $, Backbone, module*/
var Page = require('modules/page');

module.exports = Backbone.View.extend({

  el: $('#main'),

  initialize: function( params ){
    this.initializePages();
    this.scroll();

    var _this = this;

    $(window).on( 'resize', function(){
      _this.initializePages();
    });

    this.$('.ui-active').show().next().show();

    return this;
  },

  pages: {},

  initializePages: function(){
    var
      _height = 0,
      _this   = this;

    this.$('article').each(function(i, elem){
      var _elem = $(elem);

      _this.pages[ elem.id ] = new Page({
        el: _elem,
        parent: _this
      }, i);

      _this.pages[ elem.id ].render();

      _elem
        .css('z-index', 200 - i )
        .data('height', _height);

      _height += _elem.height();

    });

    this.el.css('height', _height);
  },

  scroll: function(){
    var
      _this   = this,
      _window = $(window);

    _window.on('scroll', function(e){
      var
        _active       = _this.$('.ui-active'),
        scroll_pos    = _window.scrollTop(),
        active_height = _active.data('height'),
        scroll_offset = scroll_pos - active_height;

      // Scroll the active page and make sure the page below is visible
      _active
        .css({ 'translateY': '-'+ scroll_offset })
        .next().show();

      // When scrolling to the top of the page, activate sections in reverse
      // order
      if( scroll_offset < 0  ) {
        return _this.setActive( scroll_pos, 'prev' );
      }

      // Activate the next section when the window passes the active section
      if( _active.height() - scroll_offset  < 0 ){
        return _this.setActive( scroll_pos );
      }

      return false;
    });
  },

  setActive: function( offset, method ){
    method = method || 'next';

    var
      current    = this.$('.ui-active'),
      new_active = current[ method ]();

    if( method === 'prev' ){
      current.css('translateY', 0);
    }

    if( new_active.length ){
      this.pages[ current.attr('id') ].trigger('hide');
      this.pages[ new_active.attr('id') ].trigger('show');
    }

  }

});
}, "modules/page": function(exports, require, module) {/*global $, Backbone, module, Bombers*/
module.exports = Backbone.View.extend({

  initialize: function( params, index  ){
    this.index  = index;
    this.id     = this.el.attr('id');
    this.parent = params.parent;

    this.route = this.el.data('route') || this.id;

    this.bind( 'show', this.onShow, this );
    this.bind( 'hide', this.onHide, this );

    //Bombers.app.router.route( this.id, this.id, function( id ){
      //console.log(id);
    //});
  },

  onShow: function(){
    this.el.addClass('ui-active');
    Bombers.app.router.navigate( this.route );
  },

  onHide: function(){
    this.el.removeClass('ui-active');
  }


});
}});
