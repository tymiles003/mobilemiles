/*global define */

define([
  'jquery',
  './view',
  'text!tmpl/titlebar.html'
], function($, View, template) {

  var _super = View.prototype;

  return View.extend({
    me: 'titlebar.view',

    events: {
      'click button.back': 'goBack'
    },

    initialize: function() {
      _super.initialize.apply(this, arguments);
    },

    render: function() {
      return _super.render.call(this, template);
    },

    authorized: function() {
      _super.render.call(this, template);
    },

    setTitle: function(str) {
      console.log('settitle:' + str);
      this.$('.text').text(str);
    },

    goBack: function() {
      window.history.back();
    }
  });
});