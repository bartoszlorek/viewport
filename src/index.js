// Browser compatibility
// IE9+, Firefox, Chrome, Safari, Opera

import {
    addEventListener,
    removeEventListener,
    dispatchEvent
} from './.utils/event-polyfill'

import makeCreateEvent from './.internal/create-event'
import bindMethods from './.internal/bind-methods'
import EVENT_OPTIONS from './event-options'
import EVENT_METHODS from './event-methods'

function createViewport(view = window) {
    const methods = bindMethods(view, EVENT_METHODS)
    const events = {}

    const createEvent = makeCreateEvent({
        addEventListener,
        removeEventListener,
        view
    })
    Object.keys(EVENT_OPTIONS).forEach(name => {
        events[name] = createEvent(
            EVENT_OPTIONS[name],
            methods
        )
    })

    const getValidEvent = name => {
        if (!events[name]) {
            throw new Error(`'${name}' is not a valid event name`)
        }
        return events[name]
    }

    const api = {
        on: (name, fn) => {
            let event = getValidEvent(name)
            if (typeof fn === 'function') {
                event.subscribers.add(fn)
            }
            return api
        },

        off: (name, fn) => {
            if (name === undefined) {
                Object.keys(events).forEach(name => {
                    events[name].subscribers.empty()
                })
            } else {
                let event = getValidEvent(name)
                if (typeof fn === 'function') {
                    event.subscribers.remove(fn)
                } else if (fn === undefined) {
                    event.subscribers.empty()
                }
            }
            return api
        },

        trigger: name => {
            let event = getValidEvent(name).clearCache()
            dispatchEvent(view, event.type[0])
            return api
        }
    }

    // add static methods to the API
    Object.keys(methods).forEach(name => {
        api[name] = methods[name]
    })

    return api
}

export default createViewport
