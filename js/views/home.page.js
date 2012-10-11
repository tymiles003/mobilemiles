/*global define */

define([
  'jquery',
  './page',
  'text!tmpl/home.html'
], function($, Page, template) {

  var _super = Page.prototype;

  return Page.extend({
    me: 'home.page',

    id: 'homepage',

    title: 'Home',
    
    unauthorized: function() {
      _super.unauthorized.call(this);
    },

    authorized: function() {
      return this.render(template);
    }
  });
});