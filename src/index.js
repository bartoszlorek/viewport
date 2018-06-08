// Browser compatibility
// IE9+, Firefox, Chrome, Safari, Opera

import { addEventListener, removeEventListener } from './.utils/event-listener'
import makeCreateEvent from './.internal/create-event'

import EVENT_OPTIONS from './event-options'
import EVENT_METHODS from './event-methods'

function createViewport(view = window) {
    const events = {}
    const createEvent = makeCreateEvent({
        addEventListener,
        removeEventListener,
        view
    })
    Object.keys(EVENT_OPTIONS).forEach(name => {
        events[name] = createEvent(
            EVENT_OPTIONS[name],
            EVENT_METHODS
        )
    })

    const getValidEvent = name => {
        if (!events[name]) {
            throw new Error(`The '${name}' is not a valid event name.`)
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
                    events[name].subscribers.removeAll()
                })
            } else {
                let event = getValidEvent(name)
                if (typeof fn === 'function') {
                    event.subscribers.remove(fn)
                } else if (fn === undefined) {
                    event.subscribers.removeAll()
                }
            }
            return api
        },

        trigger: name => {
            getValidEvent(name).publisher(true)
            return api
        }
    }

    // add static methods to the API
    Object.keys(EVENT_METHODS).forEach(name => {
        api[name] = EVENT_METHODS[name]
    })

    return api
}

export default createViewport
