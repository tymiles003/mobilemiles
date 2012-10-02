/*global define,require */

define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {
  var _routes,
      _onViewLoaded,
      _mergeRoutes;

  _routes = {
    '': 'home',
    'home': 'home',
    'login': 'login',
    'list': 'list'
  };

  _onViewLoaded = function(TheClass) {
    this.$viewport.empty();
    if (this.view) {
      this.view.destroy();
    }

    this.view = new TheClass(this.$viewport);
    this.view.render().attach();
  };

  _mergeRoutes = function() {
    var key,
        originalRoutes = _.clone(this.routes);

    // Get routes from `_routes` that aren't duplicated in `this.routes`.
    this.routes = {};
    for (key in _routes) {
      if (! originalRoutes[key]) {
        this.routes[key] = _routes[key];
      }
    }
    
    // Call internal bind function.
    this._bindRoutes();

    // Restore original routes, plus the merged ones from `_routes`.
    //_.extend(this.routes, originalRoutes);
  };

  return Backbone.Router.extend({
    initialize: function($viewport) {
      _mergeRoutes.call(this);
      
      Backbone.history.start();
      this.$viewport = $viewport;
    },

    load: function(uri) {
      //TODO: error handling (useful for connectivity issues)
      require([uri], _onViewLoaded.bind(this));
    },

    home: function() {
      this.load.call(this, 'views/home.page');
    },

    login: function() {
      this.load.call(this, 'views/login.page');
    },

    list: function() {
      this.load.call(this, 'views/list.page');
    }
  });
});