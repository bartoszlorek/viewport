import mapArguments from './map-arguments'
import isEqualArray from '../.utils/is-equal-array'
import Container from '../.utils/container'

function createEvent(runtime) {

    const addEventPublisher = ({ type, publisher }) => {
        type.forEach(name => {
            runtime.addEventListener(runtime.view, name, publisher)
        })
    }
    const removeEventPublisher = ({ type, publisher }) => {
        type.forEach(name => {
            runtime.removeEventListener(runtime.view, name, publisher)
        })
    }

    return (options, methods) => {
        let cachedValues = []

        const execArguments = mapArguments(
            options.args,
            methods
        )
        const self = {
            type: options.type,
            subscribers: new Container(
                null,
                () => addEventPublisher(self),
                () => removeEventPublisher(self)
            ),

            publisher: event => {
                let values = execArguments(event),
                    result

                if (values.length > 1) {
                    let shouldUpdate = !isEqualArray(cachedValues, values, 1)
                    
                    cachedValues = values
                    if (!shouldUpdate) {
                        return false
                    }
                }
                self.subscribers.forEach(subscriber => {
                    result = subscriber.apply(null, values)
                })
                if (result !== undefined) {
                    event.returnValue = result
                }
                return result
            },

            clearCache: () => {
                cachedValues = []
                return self
            }
        }

        return self
    }
}

export default createEvent
