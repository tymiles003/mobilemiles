define([
  'jquery',
  './view',
  'text!tmpl/login.html'
], function($, View, template) {

  var _super = View.prototype;

  return View.extend({
    render: function() {
      return _super.render.call(this, template);
    }
  });
});