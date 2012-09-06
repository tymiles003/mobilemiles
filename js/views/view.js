define([
  'jquery',
  '_',
  'backbone',
  'modernizr'
], function($, _, Backbone, Modernizr) {
  var _delegateEventSplitter = /^(\S+)\s*(.*)$/, // from Backbone.View
      _filterEvents,
      CLICK_OR_TAP = 'clickOrTap';

  /**
   * Filter and rename Backbone.View events to use device-specific listeners.
   */
  _filterEvents = function() {
    var key,
        match,
        events = this.events;

    for (key in events) {
      match = key.match(_delegateEventSplitter);
      if (match[1] === CLICK_OR_TAP) {
        // Found 'clickOrTap' event. Rectify it based on device capabilities.
        // Can't rename the key, so create a new one, and delete the old one.
        events[key.replace(key, Modernizr.touch ? 'tap' : 'click')] = events[key];
        delete events[key];
      }
    }
  };

  return Backbone.View.extend({
    /**
     * Initialize
     */
    initialize: function($parent) {
      _filterEvents.call(this);
      this.$parent = $parent;
    },

    /**
     * Attaches `this.$el` to the specified parent.
     */
    attach: function() {
      this.$el.appendTo(this.$parent);
      return this;
    },

    /**
     * Default render function. Assumes you're passing in a templatable string
     * `markup`. Passes a JSON-ified copy of `this.model` to the templating
     * engine, unless a model is given.
     *
     * NOTE: derived classes should implement `render` with no parameters, and
     * that should be calling this function. For example:
     *
     * define(['myCool.html'], function(myCoolTemplate) {
     *   var MyCoolView = View.extend({
     *     render: function() {
     *       _super.render(myCoolTemplate, {id: 4});
     *     }
     *   });
     * });
     *
     * This choice was made to avoid saving the template string onto every
     * instance of the class.
     */
    render: function(markup, model) {
      model = model || this.model;
      var markup = _.template(markup, model ? model.toJSON() : {});

      this.$el.html(markup);
      return this;
    }
  });
});