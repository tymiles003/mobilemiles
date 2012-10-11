/*global define */

define([
  'jquery',
  'underscore',
  './page',
  'models/auth',
  'models/documents',
  'text!tmpl/list.html',
  'text!tmpl/list_row.html'
], function($, _, Page, Auth, Documents, template, rowTemplate) {

  var _super = Page.prototype,
      _onAdd,
      _onReset;

  _onAdd = function(model) {
    var markup = _.template(rowTemplate, model.toJSON());
    this.$el.find('#vehicle-list').append(markup);
  };

  _onReset = function() {
    this.$el.find('.loading').hide();
  };

  return Page.extend({
    me: 'list.page',

    title: 'Vehicles',

    events: {
      'click li': 'changeVechicle'
    },

    initialize: function() {
      _super.initialize.apply(this, arguments);
      _.bindAll(this, '_onAdd', '_onReset');
    },

    authorized: function() {
      _super.render.call(this, template);
      this.$el.find('.loading').show();

      this.collection = new Documents()
        .on('add', _onAdd.bind(this))
        .on('reset', _onReset.bind(this))
      ;
    },

    changeVechicle: function(e) {
      $('li').removeClass('checked');
      $(e.currentTarget).addClass('checked');
    }
  });
});