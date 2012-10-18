/*global define */

define([
  'jquery',
  'underscore',
  './view',
  'models/auth',
  'text!tmpl/loading.html',
  'text!tmpl/authorizing.html',
  'text!tmpl/unauthorized.html'
], function($, _, View, Auth, loadingTemplate, authorizingTemplate, unauthorizedTemplate) {
  var _super = View.prototype;

  return View.extend({
    // Display the back button?
    hasBack: true,

    initialize: function() {
      _super.initialize.apply(this, arguments);

      // Set up authorization class. Extending classes should implement the
      // appropriate callbacks. In general, code your initialization code in
      // 'authorized'.
      _.bindAll(this, 'authReady', 'authorizing', 'authorized', 'unauthorized');
      this.auth = new Auth()
        .on('ready', this.authReady)
        .on('authorizing', this.authorizing)
        .on('authorized', this.authorized)
        .on('unauthorized', this.unauthorized)
      ;
    },

    destroy: function() {
      this.auth
        .off('ready', this.authReady)
        .off('authorizing', this.authorizing)
        .off('authorized', this.authorized)
        .off('unauthorized', this.unauthorized)
      ;
    },

    authReady: function() {
      return this.render(loadingTemplate);
    },

    authorizing: function() {
      return this.render(authorizingTemplate);
    },

    // Stub out this function (otherwise _.bindAll related errors will crop up
    // if the extending class does not implement this function).
    authorized: function() { },

    unauthorized: function() {
      //return this.render(unauthorizedTemplate);
      this.trigger('unauthorized');
      return this;
    }
  });
});