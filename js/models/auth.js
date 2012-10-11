/*global define, require, gapi */

define([
  'backbone',
  'underscore'
], function(Backbone, _) {
  var Auth,
      I,
      _gapiUrl = 'https://apis.google.com/js/client.js',
      _clientId = '691533403331.apps.googleusercontent.com',
      _apiKey = 'AIzaSyBheS8XJ8VYPsy4xk2UjGdGGANIvnHoCxQ';

  Auth = function() {
    _.bindAll(this, '_checkAuth', '_onAuthResult');
    this._checkAuthImmediate = this._checkAuth.bind(this, true);
    return this;
  };

  window.mobileMilesGapiReady = function() {
    if (I) {
      I.trigger('ready');

      // Set API key
      gapi.client.setApiKey(_apiKey);

      // Check auth
      window.setTimeout(I._checkAuthImmediate, 1);
    }
  };

  _.extend(Auth.prototype, Backbone.Events, {
    scopes: 'https://www.googleapis.com/auth/drive',

    check: function() {
      require(['js!' + _gapiUrl + '?onload=mobileMilesGapiReady']);
      return this;
    },

    prompt: function() {
      this._checkAuth(false);
      return this;
    },

    _checkAuth: function(immediate) {
      this.trigger('authorizing');

      gapi.auth.authorize({
        client_id: _clientId,
        scope: this.scopes,
        immediate: immediate
      }, this._onAuthResult);
    },

    _onAuthResult: function(result) {
      if (! result || result.error) {
        this.authorized = false;
        this.trigger('unauthorized');
      }
      else {
        this.authorized = true;
        this.trigger('authorized');
      }
    }
  });

  return function() {
    if (! I) {
      console.log('Instantiating auth');
      I = new Auth().check();
    }
    else if (I.authorized) {
      console.log('returning pre-authorized instance');
      window.setTimeout(function() {
        I.trigger('authorized');
      }, 1);
    }
    else {
      console.log('instantiated but not yet authorized...wait for "authorized" event');
    }

    return I;
  };
});