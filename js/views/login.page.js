/*global define */

define([
  'jquery',
  './view',
  'text!tmpl/login.html'
], function($, View, template) {

  var _super = View.prototype;

  return View.extend({
    me: 'login.page',

    render: function() {
      return _super.render.call(this, template);
    }
  });
});