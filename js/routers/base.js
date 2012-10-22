/*global define */

define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone) {
  var _routes,
      _mergeRoutes;

  _routes = {
    '': 'home',
    'home': 'home',
    'login': 'login',
    'vehicle': 'vehicle',
    'about': 'about',
    'recent': 'recent'
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
    initialize: function(app) {
      _mergeRoutes.call(this);
      this.app = app;
    },

    _getRouteFromHashLocation: function() {
      var hash = window.location.hash;
      if (hash.length) {
        hash = hash.substr(1);
        if (hash.length && typeof this.routes[hash] !== 'undefined') {
          return this.routes[hash];
        }
      }
      return this.routes[''];
    },

    start: function() {
      // Start Backbone.history
      var loc = window.location;
      Backbone.history.start({
        pushState: true,
        root: loc.protocol + '//' + loc.host + loc.pathname
      });

      // Go to initial route. Translates hash-url into the proper location, if
      // needed. Defaults to this.routes[''].
      this[this._getRouteFromHashLocation()]();
      return this;
    },

    stop: function() {
      Backbone.history.stop();
      return this;
    },

    home: function() {
      this.app.load('views/home.page');
    },

    login: function() {
      this.app.load('views/login.page');
    },

    vehicle: function() {
      this.app.load('views/vehicle.page');
    },

    about: function() {
      this.app.load('views/about.page');
    },

    recent: function() {
      this.app.load('views/recent.page');
    }
  });
});