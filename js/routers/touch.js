define([
  'jquery',
  'routers/base'
], function($, BaseRouter) {
  var _super = BaseRouter.prototype;

  return BaseRouter.extend({
    routes: {
      'mobileonly': 'mobileOnly'
    },

    mobileOnly: function() {
      // Sample mobile only route
    }
  });
});