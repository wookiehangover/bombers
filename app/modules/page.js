/*global $, Backbone, module, Bombers*/
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
