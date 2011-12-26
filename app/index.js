/*jshint onevar: false*/
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
