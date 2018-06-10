import mapArguments from './map-arguments'
import Container from '../.utils/container'

class ViewEvent {
    constructor(runtime, options, methods) {
        this.runtime = runtime || {}

        this.type = options.type
        this.args = mapArguments(
            options.args,
            methods
        )
        this.cachedValues = []
        this.publisher = this.publisher.bind(this)
        this.subscribers = new Container(
            null,
            () => this.addEventPublisher(),
            () => this.removeEventPublisher()
        )
    }

    publisher(event) {
        let values = args(event),
            result

        if (values.length > 1) {
            let shouldUpdate = !isEqualArray(this.cachedValues, values, 1)
            
            this.cachedValues = values
            if (!shouldUpdate) {
                return false
            }
        }
        this.subscribers.forEach(subscriber => {
            result = subscriber.apply(null, values)
        })
        if (result !== undefined) {
            event.returnValue = result
        }
        return result
    }

    clearCache() {
        this.cachedValues = []
        return this
    }

    addEventPublisher() {
        const { view, addEventListener } = this.runtime
        this.type.forEach(name => {
            addEventListener(view, name, this.publisher)
        })
    }

    removeEventPublisher() {
        const { view, removeEventListener } = this.runtime
        this.type.forEach(name => {
            removeEventListener(view, name, this.publisher)
        })
    }
}

export default ViewEvent
