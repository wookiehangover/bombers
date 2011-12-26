/*global Backbone*/
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
