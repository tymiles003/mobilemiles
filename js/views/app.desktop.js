/*global define */

define([
  'jquery',
  './app',
  'text!tmpl/app.desktop.html',
  'link!css/desktop.css'
], function($, MobileMiles, template) {
  var _super = MobileMiles.prototype;

  return MobileMiles.extend({
    me: 'app.desktop',

    render: function() {
      return _super.render.call(this, template);
    }
  });
});