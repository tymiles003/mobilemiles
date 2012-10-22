/*global define, require */

define([
  'jquery',
  'underscore',
  'backbone',
  './view'
], function($, _, Backbone, View) {
  var _super = View.prototype;

  return View.extend({
    id: 'app',
    
    initialize: function() {
      _super.initialize.call(this, {
        app: this,
        $parent: 'body'
      });

      _.bindAll(this, '_onViewLoaded', '_onUnauthorized');
    },

    setRouter: function(r) {
      this.router = r;
      return this;
    },

    load: function(uri) {
      //TODO: error handling (useful for connectivity issues)
      require([uri], this._onViewLoaded);
    },

    _onViewLoaded: function(TheClass) {
      // Unload current page
      this.$viewport.empty();
      if (this.currentPage) {
        this.currentPage.off('unauthorized', this._onUnauthorized);
        this.currentPage.destroy();
      }

      // Load new page
      this.currentPage = new TheClass({
        app: this,
        $parent: this.$viewport
      });

      this.currentPage.on('unauthorized', this._onUnauthorized);
      this._setTitlebar();
      this.currentPage.render().attach();
    },

    _setTitlebar: function() {
      var page = this.currentPage,
          t,
          b;

      if (page) {
        t = page.title;
        b = page.hasBack;
      }
      else {
        t = '';
        b = false;
      }

      this.titlebar.setTitle(typeof t === 'function' ? t() : t);
      this.titlebar.showBackButton(typeof b === 'function' ? b() : b);
    },

    setVehicle: function(val) {
      this.vehicle = val;
      //TODO: persist
    },

    _onUnauthorized: function() {
      Backbone.history.navigate('login', {trigger: true});
    },

    run: function() {
      this.render().attach();
      this.$viewport = this.$el.find('#content');

      this.router.start();
      return this;
    }
  });
});