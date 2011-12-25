
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
}).call(this)({"index": function(exports, require, module) {/*global Backbone, jQuery */
(function($){
  require('lib/bombers');

  var App = Backbone.View.extend({
    el: $('#main'),

    initialize: function(){
      this.setHeight();
      this.scroll();

      var _this = this;

      $(window).on( 'resize', function(){
        _this.setHeight();
      });

      this.active.show().next().show();
    },

    active: $('.ui-active'),

    scroll: function(){
      var
        _this   = this,
        _window = $(window);

      _window.on('scroll', function(e){
        var
          _active      = _this.$('.ui-active'),
          scrollHeight = _window.scrollTop(),
          activeOffset = _active.data('height');

        // Scroll the active page and make sure the page below is visible
        _active
          .css({ 'translateY': '-'+ ( scrollHeight - activeOffset ) })
          .next().show();

        // Activate the next section when the window passes the active section
        if( _active.height() - ( scrollHeight - activeOffset )  < 0 ){
          return _this.setActive( scrollHeight );
        }

        // When scrolling to the top of the page, activate sections in reverse
        // order
        if( activeOffset - scrollHeight > 0  ) {
          return _this.setActive( scrollHeight, 'prev' );
        }
        return false;
      });
    },

    setActive: function( offset, method ){
      method = method || 'next';

      var
        current    = $('.ui-active'),
        new_active = current[ method ]();

      if( method === 'prev' ){
        current.css('translateY', 0);
      }

      if( new_active.length ){
        $('.ui-active').removeClass('ui-active');
        new_active.addClass('ui-active');
      }

    },

    setHeight: function(){
      var _height = 0;

      this.$('article').each(function(i, elem){
        var _elem = $(elem);

        _elem
          .css({
            'z-index': 200 - i
          })
          .data('height', _height);

        _height += _elem.height();

      });

      this.el.css('height', _height);
    }

  });

  jQuery(function($){
    new App();
  });


}).call(this, jQuery);
}, "lib/bombers": function(exports, require, module) {this.Bombers = {
  app: _.extend({}, Backbone.Events)
};

jQuery(function($) {

  var app = Bombers.app;

  // All navigation that is relative should be passed through the navigate
  // method, to be processed by the router.
  $(document).delegate("a", "click", function(evt) {
    // Get the anchor href and protcol
    var
      href = $(this).attr("href"),
      protocol = this.protocol + "//";

    // Ensure the protocol is not part of URL, meaning its relative.
    if (href.slice(protocol.length) !== protocol) {
      // Stop the event bubbling to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      // Note by using Backbone.history.navigate, router events will not be
      // triggered.  If this is a problem, change this to navigate on your
      // router.
      app.router.navigate(href, true);
    }
  });

  // Defining the application router, you can attach sub routers here, but
  // typically if you're going to work with more than one router, you will
  // use something like backbone.routemanager.
  var Router = Backbone.Router.extend({
    routes: {
      "": "index"
    },

    index: function() {
      $('html,body').stop().animate({ scrollTop: 0 }, 100);
    }
  });

  // Define your master router on the application bombers and trigger all
  // navigation from this instance.
  app.router = new Router();

  // Trigger the initial route and enable HTML5 History API support
  Backbone.history.start();

});
}, "modules/page": function(exports, require, module) {
}});
