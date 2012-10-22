/*global define */

define([
  'jquery',
  'underscore',
  './app',
  './titlebar',
  'text!tmpl/app.desktop.html',
  'link!css/desktop.css'
], function($, _, MobileMiles, Titlebar, template) {
  var _super = MobileMiles.prototype;

  return MobileMiles.extend({
    me: 'app.desktop',

    initialize: function() {
      _super.initialize.apply(this, arguments);
      this.titlebar = new Titlebar({
        app: this,
        $parent: '#titlebar'
      });

      // Link click handler
      _.bindAll(this, '_clickHandler');
      $('body').on('click', 'a', this._clickHandler);
    },

    _clickHandler: function(e) {
      var t = e.currentTarget,
          href = t.href,
          $t = $(t),
          dataExt = $t.data('external'),
          ext = dataExt === 'true' || dataExt === true;

      // Let external link process normally
      if (! ext) {
        e.preventDefault();
      }
      
      // Navigate to href location, unless this is a void URL.
      if (! ext && href !== 'javascript:void(0);' && href !== '#') {
        this.router.navigate($t.attr('href'), {
          trigger: true
        });
      }
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