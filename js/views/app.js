/*global define, require */

define([
  'jquery',
  'underscore',
  './view'
], function($, _, View) {
  var _super = View.prototype;

  return View.extend({
    id: 'app',
    
    initialize: function() {
      _super.initialize.call(this, 'body');
      _.bindAll(this, '_onViewLoaded');
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
      this.$viewport.empty();
      if (this.view) {
        this.view.destroy();
      }

      this.view = new TheClass(this.$viewport);
      this._setTitle();
      this.view.render().attach();
    },

    _setTitle: function() {
      var t = this.view ? this.view.title : '';
      this.titlebar.setTitle(typeof t === 'function' ? t() : t);
    },

    run: function() {
      this.render().attach();
      this.$viewport = this.$el.find('#content');

      this.router.start();
      return this;
    }
  });
});