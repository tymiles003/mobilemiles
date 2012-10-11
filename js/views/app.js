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
      if (this.currentPage) {
        this.currentPage.destroy();
      }

      this.currentPage = new TheClass(this.$viewport);
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

    run: function() {
      this.render().attach();
      this.$viewport = this.$el.find('#content');

      this.router.start();
      return this;
    }
  });
});