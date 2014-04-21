/*global define */

define([
  'jquery',
  './page',
  'models/entries',
  'text!tmpl/recent.html'
], function($, Page, Entries, template) {

  var _super = Page.prototype,
      _onAdd,
      _onReset;

  _onAdd = function(model) {
    console.log(model);
  };

  _onReset = function() {
    console.log('All entries loaded')
  };

  return Page.extend({
    me: 'recent.page',

    id: 'recentpage',

    title: 'Recent',

    render: function() {
      _super.render.call(this, template, this.app.vehicle);

      this.collection = new Entries(this.app.getVehicle().id)
        .on('add', _onAdd.bind(this))
        .on('reset', _onReset.bind(this))
      ;

      return this;
    }
  });
});