/*global $, Backbone, module, Bombers*/
module.exports = Backbone.View.extend({

  initialize: function( params, index  ){
    this.index  = index;
    this.id     = this.el.attr('id');
    this.parent = params.parent;

    this.route = this.el.data('route') || this.id;

    this.bind( 'show', this.onShow, this );
    this.bind( 'hide', this.onHide, this );
  },

  onShow: function(){
    this.el.addClass('ui-active');
    this.navigate();
  },

  onHide: function(){
    this.el.removeClass('ui-active');
  },

  show: function( time, offset ){
    offset = offset || 0;

    var
      dfd = new $.Deferred(),
      current = $('.ui-active').index(),
      speed   = time || ( current === this.index ? 600 : 600 * this.index );

    $('html,body')
      .stop()
      .animate({ scrollTop: this.el.data('height') + offset }, speed, 'easeInOutQuad', function(){
        dfd.resolve();
      });

    return dfd.promise();
  },

  navigate: function(){

    if( $('html,body').is(':animated') === false ){
      Bombers.app.router.navigate( this.route, false );
    }

    return this;
  }
});
