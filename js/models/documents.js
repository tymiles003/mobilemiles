/*global define, gapi */

define([
  'backbone',
  './document'
], function(Backbone, Document) {
  var _doFetch;

  _doFetch = function() {
    var i, q, items,
        self = this;

    q = "mimeType = '" + this.requestMime + "'";
    if (this.requestFilter && this.requestFilter.length) {
      q += ' and ' + this.requestFilter;
    }

    gapi.client.load('drive', 'v2', function() {
      var request = self.requestFunction()({q: q});

      request.execute(function(resp) {
        if (resp) {
          items = resp.items;
          if (items) {
            for (i = 0; i < items.length; i++) {
              //TODO: filter response object
              self.add(new Document(items[i]));
            }
          }

          self.trigger('reset');
        }
      });
    });
  };

  return Backbone.Collection.extend({
    requestFunction: function() {
      return gapi.client.drive.files.list;
    },
    requestFilter: "title contains 'mobilemiles'",
    requestMime: 'application/vnd.google-apps.spreadsheet',

    initialize: function() {
      this.fetch();
    },

    fetch: function() {
      _doFetch.call(this);
    }
  });
});