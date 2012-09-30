define([
  'jquery',
  './app',
  'text!tmpl/app.touch.html',
  'link!css/touch.css'
], function($, MobileMiles, template) {
  var _super = MobileMiles.prototype;

  return MobileMiles.extend({
    me: 'app.touch',
    
    render: function() {
      return _super.render.call(this, template);
    }
  });
});