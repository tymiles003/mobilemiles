define([
  'domlib', 'backbone', 'underscore'
], function($, Backbone, _) {
  var View = Backbone.View.extend({
    /**
     * Create 'super' method which gives extending classes access to methods
     * defined on this base class's prototype.
     *
     * http://forrst.com/posts/Backbone_js_super_function-4co
     */
    super: function(funcName) {
      return this.constructor.__super__[funcName].apply(this, _.rest(arguments));
    },

    /**
     * Initialize
     */
    initialize: function($parent, template, model) {
      this.$parent = $parent;
      this.template = template;
      this.model = model;
      return this;
    },

    /**
     * Attaches `this.$el` to the specified parent.
     */
    attach: function() {
      this.$parent.append(this.$el);
      return this;
    },

    /**
     * Default render function. Sets $el to processed `this.template`. Passes
     * JSON-ified copy of `this.model` to templating engine.
     */
    render: function() {
      var markup = _.template(this.template, this.model.toJSON()); 
      this.$el.html(markup);
      return this;
    }
  });

  return View;
});