/*global $, Backbone, module*/
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

    return this;
  },

  pages: {},

  getPage: function( id ){
    return _( this.pages ).find(function( page ){
      if( page.id == id || page.route == id ){
        return true;
      }
    });
  },

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
