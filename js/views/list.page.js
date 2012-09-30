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
      _onAdd;

  _onAdd = function(model) {

    var markup = _.template(rowTemplate, model.toJSON());
    $('#vehicle-list').append(markup);
  };

  return Page.extend({
    me: 'list.page',

    authorized: function() {
      _super.render.call(this, template);
      var list = new Documents();
      list.on('add', _onAdd.bind(this));
    }
  });
});