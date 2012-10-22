/*global define */

define([
  'jquery',
  './page',
  'text!tmpl/recent.html'
], function($, Page, template) {

  var _super = Page.prototype;

  return Page.extend({
    me: 'recent.page',

    id: 'recentpage',

    title: 'Recent',

    render: function() {
      return _super.render.call(this, template, this.app.vehicle);
    }
  });
});