/*global define */

define([
  'jquery',
  './page',
  'text!tmpl/login-authorized.html',
  'text!tmpl/login.html'
], function($, Page, authorizedTemplate, unauthorizedTemplate) {

  var _super = Page.prototype;

  return Page.extend({
    me: 'login.page',
    
    title: 'Login',

    events: {
      'click #logIn': 'onLogIn'
    },

    render: function() {
      if (this.auth.authorized) {
        this.authorized();
      }
      else {
        this.unauthorized();
      }

      return this;
    },

    unauthorized: function() {
      return _super.render.call(this, unauthorizedTemplate);
    },

    authorized: function() {
      _super.render.call(this, authorizedTemplate);
      
      window.setTimeout(function() {
        window.history.back();
      }, 1000);
    },

    onLogIn: function() {
      this.auth.prompt();
    }
  });
});