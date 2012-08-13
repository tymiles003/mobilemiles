define([
  'jquery','backbone','views/home.page'
], function($, Backbone, HomePage) {
  var Router = Backbone.Router.extend({
    initialize: function() {
      Backbone.history.start();
    },

    routes: {
      '': 'home'
    },

    home: function() {
      var page = new HomePage();
      page.render();
    }
  });

  return Router;
});