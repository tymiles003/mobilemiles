// Sets the require.js configuration for your application.
require.config({
  paths: {
    // Core Libraries
    modernizr: 'libs/modernizr-2.5.3',
    domlib: 'libs/jquery-1.8.0',
    underscore: 'libs/lodash-0.4.2',
    backbone: 'libs/backbone-0.9.2',

    // Require.js Plugins
    text: 'plugins/text-2.0.0'
  },

  // Sets the configuration for your third party scripts that are not AMD compatible
  shim: {
    'backbone': {
      deps: ['underscore', 'domlib'],
      exports: 'Backbone'  //attaches "Backbone" to the window object
    }
  }
});

// Include Desktop Specific JavaScript files here (or inside of your Desktop router)
require([
  'modernizr', 'domlib', 'backbone', 'routers/desktop'
], function(Modernizr, $, Backbone, Desktop) {
  // Instantiates a new Router
  this.router = new Desktop();
});