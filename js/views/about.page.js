/*global define */

define([
  'jquery',
  './page',
  'text!tmpl/about.html'
], function($, Page, template) {

  var _super = Page.prototype;

  return Page.extend({
    me: 'about.page',

    id: 'aboutpage',

    title: 'About MobileMiles',

    render: function() {
      return _super.render.call(this, template);
    }
  });
});