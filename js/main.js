define([], function() {
  // Set a few RequireJS constants
  require.config({
    baseDir: './',
    paths: {
      // Plugin relocation
      link: 'lib/link',
      text: 'lib/text',

      // Folders
      css: '../css',
      tmpl: '../tmpl',
      
      // Libraries
      _: 'lib/lodash-0.4.2',
      backbone: 'lib/backbone-0.9.2',
      modernizr: 'lib/modernizr-2.5.3'
    }
  });

  // Pull in Modernizr to determine platform. Then load the rest of the app at
  // that point.
  require(['modernizr'], function(Modernizr) {
    // Load the appropriate version, based on device type
    var mode = Modernizr.touch ? 'touch' : 'desktop';

    require([
      'views/app.' + mode,
      'routers/' + mode
    ], function(MobileMiles, Router) {
      var app = new MobileMiles().run();
          router = new Router(app.$el.find('#content'));
    });
  });
});