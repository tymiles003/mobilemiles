define([
  'jquery',
  '_',
  'backbone'
], function($, _, Backbone) {
  var _routes,
      _onViewLoaded;

  _routes = {
    '': 'home',
    'home': 'home',
    'login': 'login'
  };

  _onViewLoaded = function(TheClass) {
    this.$viewport.empty();
    var inst = new TheClass(this.$viewport);
    inst.render().attach();
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

    // Restore original routes, plus the merges ones from `_routes`.
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
    }
  });
});