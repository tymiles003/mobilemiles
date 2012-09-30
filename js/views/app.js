/*global define */

define([
  'jquery',
  './view'
], function($, View) {
  var _super = View.prototype;

  return View.extend({
    id: 'app',
    
    initialize: function() {
      _super.initialize.call(this, 'body');
    },

    run: function() {
      return this.render().attach();
    }
  });
});