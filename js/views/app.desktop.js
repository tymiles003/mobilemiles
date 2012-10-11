/*global define */

define([
  'jquery',
  './app',
  './titlebar',
  'text!tmpl/app.desktop.html',
  'link!css/desktop.css'
], function($, MobileMiles, Titlebar, template) {
  var _super = MobileMiles.prototype;

  return MobileMiles.extend({
    me: 'app.desktop',

    initialize: function() {
      _super.initialize.apply(this, arguments);
      this.titlebar = new Titlebar('#titlebar');

      var self = this;
      $('body').on('click', 'a', function(e) {
        e.preventDefault();
        self.router.navigate('list', {
          trigger: true
        });
        return false;
      });
    },

    render: function() {
      _super.render.call(this, template);
      this.titlebar.render();
      return this;
    },

    attach: function() {
      _super.attach.call(this);
      this.titlebar.attach();
      return this;
    }
  });
});