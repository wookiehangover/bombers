this.Bombers = {
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
