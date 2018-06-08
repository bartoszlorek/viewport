import mapArguments from './map-arguments'
import Container from '../.utils/container'

function createEvent(runtime) {

    const addEventPublisher = ({ type, publisher }) => {
        const { view, addEventListener } = runtime
        type.forEach(name => {
            addEventListener(view, name, publisher)
        })
    }
    const removeEventPublisher = ({ type, publisher }) => {
        const { view, addEventListener } = runtime
        type.forEach(name => {
            addEventListener(view, name, publisher)
        })
    }

    return (options, methods) => {
        let cachedValues = []

        const execArgs = mapArguments(
            runtime.view,
            options.args,
            methods
        )
        const self = {}

        self.type = options.type
        self.subscribers = new Container(
            () => addEventPublisher(self),
            () => removeEventPublisher(self)
        )
        self.publisher = forceUpdate => {
            const length = self.subscribers.length
            const values = execArgs()
    
            if (forceUpdate !== true && values !== null) {
                let shouldUpdate = values.some((value, index) => {
                    return cachedValues[index] !== value
                })
                cachedValues = values
                if (!shouldUpdate) {
                    return false
                }
            }
    
            self.subscribers.forEach(subscriber => {
                subscriber.apply(null, values)
            })
        }

        return self
    }
}

export default createEvent
