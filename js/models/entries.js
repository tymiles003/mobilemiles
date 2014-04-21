/*global define, gapi */

define([
  'backbone',
  './document'
], function(Backbone, Document) {
  return Backbone.Collection.extend({
    url: function() {
      return 'http://spreadsheets.google.com/feeds/ccc?key=' + this.documentId;
    },

    initialize: function(id) {
      debugger;
      this.documentId = id;
      this.fetch();
    }
  });
});