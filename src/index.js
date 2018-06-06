// Browser compatibility
// IE9+, Firefox, Chrome, Safari, Opera

import { addEventListener, removeEventListener } from './.utils/event-listener'
import createEvents from './.internal/create-events'
import createSubscribers from './.internal/create-subscribers'

import EVENT_SCHEMA from './event-schema'
import EVENT_METHODS from './event-methods'

function createViewport(view = window) {
    const events = createEvents(view, EVENT_SCHEMA, EVENT_METHODS)

    const getValidEvent = name => {
        if (!events[name]) {
            throw new Error(`The '${name}' is not a valid event name.`)
        }
        return events[name]
    }

    const subscribers = createSubscribers(
        addEventListener.bind(null, view),
        removeEventListener.bind(null, view)
    )

    const api = {
        on: (name, fn) => {
            let event = getValidEvent(name)
            if (typeof fn === 'function') {
                subscribers.add(event, fn)
            }
            return api
        },

        off: (name, fn) => {
            if (name === undefined) {
                Object.keys(events).forEach(name => {
                    subscribers.removeAll(events[name])
                })
            } else {
                let event = getValidEvent(name)
                if (typeof fn === 'function') {
                    subscribers.remove(event, fn)
                } else if (fn === undefined) {
                    subscribers.removeAll(event)
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
