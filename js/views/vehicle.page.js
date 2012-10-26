/*global define */

define([
  'jquery',
  'underscore',
  './page',
  'models/auth',
  'models/documents',
  'text!tmpl/vehicle.html',
  'text!tmpl/vehicle_row.html'
], function($, _, Page, Auth, Documents, template, rowTemplate) {

  var _super = Page.prototype,
      _onAdd,
      _onReset;

  _onAdd = function(model) {
    var modelID = model && model.get('id'),
        curVehicle = this.app.getVehicle(),
        curID = curVehicle && curVehicle.get('id'),
        markup;

    markup = _.template(rowTemplate, _.extend({}, model.toJSON(), {
      checked: modelID === curID
    }));

    this.$el.find('#vehicle-list').append(markup);
  };

  _onReset = function() {
    this.$el.find('.loading').hide();
  };

  return Page.extend({
    me: 'list.page',

    title: 'Select your vehicle',

    events: {
      'click li': 'changeVehicle'
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

    changeVehicle: function(e) {
      // Set check mark
      $('li').removeClass('checked');
      $(e.currentTarget).addClass('checked');

      // Set current vehicle, based on Google document ID
      var v = this.collection.get($(e.currentTarget).data('vehicle'));
      this.app.setVehicle(v);
    }
  });
});