import mapArguments from './map-arguments'

function createEvents(view, schema, methods) {
    const events = {}

    Object.keys(schema).forEach(name => {
        let cachedValues = []
        const { type, args } = schema[name]
        const execArguments = mapArguments(view, args, methods)

        const self = {
            type,
            subscribers: [],
            publisher: forceUpdate => {
                const length = self.subscribers.length
                const values = execArguments()

                if (forceUpdate !== true && values !== null) {
                    let shouldUpdate = values.some((value, index) => {
                        return cachedValues[index] !== value
                    })
                    cachedValues = values
                    if (!shouldUpdate) {
                        return false
                    }
                }

                let index = -1
                while (++index < length) {
                    self.subscribers[index].apply(null, values)
                }
            }
        }
        events[name] = self
    })

    return events
}

export default createEvents
