// Simple before and after filter for backbone router
// https://github.com/FLOChip/backbone_router_filter
(function() {
  _.extend(Backbone.Router.prototype, Backbone.Events, {
    before: function(){},
    after : function(){},
    route : function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        if( _(router.before).isFunction() ){
          router.before.apply(this, args);
        }
        callback && callback.apply(router, args);
        if( _(this.after).isFunction() ){
          this.after.apply(this, args);
        }
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
      });
      return this;
    }
  });
}).call(this);
