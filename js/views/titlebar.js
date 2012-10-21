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
      'click .back': 'goBack'
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
      this.$('h1').text(str);
      return this;
    },

    showBackButton: function(val) {
      var $btn = this.$('.back button');
      if (typeof val === 'undefined' || val === true) {
        $btn.removeAttr('disabled');
      }
      else {
        $btn.attr('disabled', 'disabled');
      }
      return this;
    },

    goBack: function() {
      if (! this.$('.back button').is(':disabled')) {
        window.history.back();
      }
      return this;
    }
  });
});