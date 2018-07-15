'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// automap(namespace, { actionReducers, initialState }) - returns individual mapped actions/reducers/etc
var automap = function automap() {
  var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var namespace = config.namespace,
      _config$actionReducer = config.actionReducers,
      actionReducers = _config$actionReducer === undefined ? [] : _config$actionReducer,
      _config$initialState = config.initialState,
      initialState = _config$initialState === undefined ? {} : _config$initialState,
      _config$selectors = config.selectors,
      selectors = _config$selectors === undefined ? {} : _config$selectors;

  var anyAction = function anyAction(key) {
    return key !== 'reducer' && key !== 'type';
  };

  var actions = actionReducers.reduce(function (acc, item) {
    var actions = Object.keys(item).filter(anyAction);

    actions.forEach(function (actionKey) {
      return acc[actionKey] = item[actionKey];
    });

    return acc;
  }, {});

  var reducers = actionReducers.reduce(function (acc, item) {
    var actionKey = Object.keys(item).find(anyAction);
    var reducerKey = item.type;

    if (!reducerKey) {
      // try to pull name from action
      var action = item[actionKey];
      var actionResult = typeof action === 'function' && item[actionKey]() || {};
      reducerKey = (typeof actionResult === 'undefined' ? 'undefined' : _typeof(actionResult)) === 'object' && actionResult.type;
    }

    acc[reducerKey] = item.reducer;

    return acc;
  }, {});

  var reducer = function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    if (!action) {
      throw new Error('redux-automap: no action passed to reducer(state, action) function');
    }

    var actionReducer = reducers[action.type];

    return actionReducer && actionReducer(state, action) || state;
  };

  if (namespace) {
    var _loop = function _loop(selectorKey) {
      var selector = selectors[selectorKey];
      selectors[selectorKey] = function (state) {
        return selector(state.get ? state.get(namespace) : state[namespace]);
      };
    };

    for (var selectorKey in selectors) {
      _loop(selectorKey);
    }
  }

  return Object.assign(actions, selectors, config, { namespace: namespace, actions: actions, reducers: reducers, reducer: reducer });
};

// merge([ map1, map2, ... ]) - maps reducers to their namespace for easy inclusion into store
var merge = function merge() {
  var maps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  return maps.reduce(function (acc, map) {
    var namespace = map.namespace,
        reducer = map.reducer;

    acc[namespace] = reducer;

    return acc;
  }, {});
};

var reduxAutomap = { automap: automap };

exports.automap = automap;
exports.merge = merge;
exports.default = reduxAutomap;
