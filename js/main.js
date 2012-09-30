/*global define, require */

define([], function() {
  // Set a few constants
  var config = {
    baseDir: './',
    paths: {
      // Folders
      css: 'css',
      tmpl: 'tmpl',
      models: 'js/models',
      routers: 'js/routers',
      views: 'js/views',
      
      // Libraries
      jquery: 'js/lib/jquery',
      underscore: 'js/lib/lodash-0.4.2',
      backbone: 'js/lib/backbone-0.9.2',
      modernizr: 'js/lib/modernizr-2.5.3'
    }
  };

  // Pull in Modernizr to determine platform. Then load the rest of the app.
  require(config, ['modernizr'], function(Modernizr) {
    // Load the appropriate version, based on device type
    var mode = Modernizr.touch ? 'touch' : 'desktop';

    require([
      'views/app.' + mode,
      'routers/' + mode
    ], function(MobileMiles, Router) {
      var app = new MobileMiles().run(),
          router = new Router(app.$el.find('#content'));
    });
  });
});