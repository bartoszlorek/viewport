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

function createEvents(view, schema, methods) {
    var events = {};

    Object.keys(schema).forEach(function (name) {
        var cachedValues = [];
        var _schema$name = schema[name],
            type = _schema$name.type,
            args = _schema$name.args;

        var execArguments = mapArguments(view, args, methods);

        var self = {
            type: type,
            subscribers: [],
            publisher: function publisher(forceUpdate) {
                var length = self.subscribers.length;
                var values = execArguments();

                if (forceUpdate !== true && values !== null) {
                    var shouldUpdate = values.some(function (value, index) {
                        return cachedValues[index] !== value;
                    });
                    cachedValues = values;
                    if (!shouldUpdate) {
                        return false;
                    }
                }

                var index = -1;
                while (++index < length) {
                    self.subscribers[index].apply(null, values);
                }
            }
        };
        events[name] = self;
    });

    return events;
}

function createSubscribers(addEventListener, removeEventListener) {

    var addPublisher = function addPublisher(_ref) {
        var type = _ref.type,
            publisher = _ref.publisher;

        type.forEach(function (name) {
            return addEventListener(name, publisher);
        });
    };

    var removePublisher = function removePublisher(_ref2) {
        var type = _ref2.type,
            publisher = _ref2.publisher;

        type.forEach(function (name) {
            return removeEventListener(name, publisher);
        });
    };

    return {
        add: function add(event, fn) {
            var index = event.subscribers.indexOf(fn);
            if (index === -1) {
                event.subscribers.push(fn);
                if (event.subscribers.length === 1) {
                    addPublisher(event);
                }
            }
        },

        remove: function remove(event, fn) {
            var index = event.subscribers.indexOf(fn);
            if (index > -1) {
                event.subscribers.splice(index, 1);
                if (!event.subscribers.length) {
                    removePublisher(event);
                }
            }
        },

        removeAll: function removeAll(event) {
            event.subscribers = [];
            removePublisher(event);
        }
    };
}

var EVENT_SCHEMA = {
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

    var events = createEvents(view, EVENT_SCHEMA, EVENT_METHODS);

    var getValidEvent = function getValidEvent(name) {
        if (!events[name]) {
            throw new Error('The \'' + name + '\' is not a valid event name.');
        }
        return events[name];
    };

    var subscribers = createSubscribers(addEventListener.bind(null, view), removeEventListener.bind(null, view));

    var api = {
        on: function on(name, fn) {
            var event = getValidEvent(name);
            if (typeof fn === 'function') {
                subscribers.add(event, fn);
            }
            return api;
        },

        off: function off(name, fn) {
            if (name === undefined) {
                Object.keys(events).forEach(function (name) {
                    subscribers.removeAll(events[name]);
                });
            } else {
                var event = getValidEvent(name);
                if (typeof fn === 'function') {
                    subscribers.remove(event, fn);
                } else if (fn === undefined) {
                    subscribers.removeAll(event);
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
