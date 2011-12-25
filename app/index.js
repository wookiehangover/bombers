/*global Backbone, jQuery */
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
