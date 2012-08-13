define([
  'domlib', 'backbone', './view', 'text!templates/home.html'
], function($, Backbone, View, template) {

  var Home = View.extend({
    initialize: function($parent) {
      return this.super('initialize', $parent, template, new Backbone.Model());
    }
  });

  return Home;
});