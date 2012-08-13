define([
  'jquery', 'backbone', 'views/view', 'views/home.page'
], function($, Backbone, View, HomePage) {
  var Router = Backbone.Router.extend({
    initialize: function() {
      Backbone.history.start();
    },

    routes: {
      '': 'home'
    },

    home: function() {
      var page = new HomePage($('body'));
      page.render().attach();
    }
  });

  return Router;
});