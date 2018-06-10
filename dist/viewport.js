'use strict';

function addEventListener(elem, event, fn) {
    if (elem == null) {
        return;
    }
    if (elem.addEventListener) {
        elem.addEventListener(event, fn, false);
    } else {
        elem.attachEvent('on' + event, function () {
            return fn.call(elem, window.event);
        });
    }
}

function removeEventListener(elem, event, fn) {
    if (elem == null) {
        return;
    }
    if (elem.removeEventListener) {
        elem.removeEventListener(event, fn);
    } else {
        elem.detachEvent('on' + event, fn);
    }
}

function mapArguments(view, args, methods) {
    if (args != null) {
        return function () {
            return args.map(function (arg) {
                return methods[arg](view, view.document);
            });
        };
    }
    return function () {
        return null;
    };
}

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

function Container(items, loaded, unloaded) {
    this.items = items != null ? [].concat(toConsumableArray(items)) : [];
    this.loaded = loaded || null;
    this.unloaded = unloaded || null;
}

Container.prototype = {
    get length() {
        return this.items.length;
    },

    add: function add(item) {
        var index = this.items.indexOf(item);
        if (index === -1) {
            this.items.push(item);
            if (this.loaded && this.items.length === 1) {
                this.loaded(this);
            }
        }
    },

    remove: function remove(item) {
        var index = this.items.indexOf(item);
        if (index > -1) {
            this.items.splice(index, 1);
            if (this.unloaded && !this.items.length) {
                this.unloaded(this);
            }
        }
    },

    empty: function empty() {
        this.items = [];
        if (this.unloaded) {
            this.unloaded(this);
        }
    },

    forEach: function forEach(iteratee) {
        var index = -1;
        var length = this.items.length;
        while (++index < length) {
            if (iteratee(this.items[index], index, this.items) === false) {
                return;
            }
        }
    }
};

function createEvent(runtime) {

    var addEventPublisher = function addEventPublisher(_ref) {
        var type = _ref.type,
            publisher = _ref.publisher;

        type.forEach(function (name) {
            runtime.addEventListener(runtime.view, name, publisher);
        });
    };
    var removeEventPublisher = function removeEventPublisher(_ref2) {
        var type = _ref2.type,
            publisher = _ref2.publisher;

        type.forEach(function (name) {
            runtime.removeEventListener(runtime.view, name, publisher);
        });
    };

    return function (options, methods) {
        var cachedValues = [];

        var execArgs = mapArguments(runtime.view, options.args, methods);
        var self = {
            type: options.type,
            subscribers: new Container(null, function () {
                return addEventPublisher(self);
            }, function () {
                return removeEventPublisher(self);
            }),
            publisher: function publisher(forceUpdate) {
                var values = execArgs();

                if (forceUpdate !== true && values !== null) {
                    var shouldUpdate = values.some(function (value, index) {
                        return cachedValues[index] !== value;
                    });
                    cachedValues = values;
                    if (!shouldUpdate) {
                        return false;
                    }
                }

                self.subscribers.forEach(function (subscriber) {
                    subscriber.apply(null, values);
                });
            }
        };

        return self;
    };
}

var EVENT_OPTIONS = {
    load: {
        type: ['load']
    },
    unload: {
        type: ['beforeunload']
    },
    resize: {
        type: ['resize', 'scroll', 'orientationchange'],
        args: ['width', 'height']
    },
    scroll: {
        type: ['scroll'],
        args: ['scrollX', 'scrollY']
    }
};

var EVENT_METHODS = {
    width: function width(win, doc) {
        return win.innerWidth || doc.documentElement.clientWidth || doc.body.clientWidth;
    },
    height: function height(win, doc) {
        return win.innerHeight || doc.documentElement.clientHeight || doc.body.clientHeight;
    },
    scrollX: function scrollX(win, doc) {
        return win.scrollX || win.pageXOffset;
    },
    scrollY: function scrollY(win, doc) {
        return win.scrollY || win.pageYOffset;
    }
};

// Browser compatibility

function createViewport() {
    var view = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

    var events = {};
    var createEvent$$1 = createEvent({
        addEventListener: addEventListener,
        removeEventListener: removeEventListener,
        view: view
    });
    Object.keys(EVENT_OPTIONS).forEach(function (name) {
        events[name] = createEvent$$1(EVENT_OPTIONS[name], EVENT_METHODS);
    });

    var getValidEvent = function getValidEvent(name) {
        if (!events[name]) {
            throw new Error('\'' + name + '\' is not a valid event name');
        }
        return events[name];
    };

    var api = {
        on: function on(name, fn) {
            var event = getValidEvent(name);
            if (typeof fn === 'function') {
                event.subscribers.add(fn);
            }
            return api;
        },

        off: function off(name, fn) {
            if (name === undefined) {
                Object.keys(events).forEach(function (name) {
                    events[name].subscribers.empty();
                });
            } else {
                var event = getValidEvent(name);
                if (typeof fn === 'function') {
                    event.subscribers.remove(fn);
                } else if (fn === undefined) {
                    event.subscribers.empty();
                }
            }
            return api;
        },

        trigger: function trigger(name) {
            getValidEvent(name).publisher(true);
            return api;
        }

        // add static methods to the API
    };Object.keys(EVENT_METHODS).forEach(function (name) {
        api[name] = EVENT_METHODS[name];
    });

    return api;
}

module.exports = createViewport;
