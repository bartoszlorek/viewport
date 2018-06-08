import mapArguments from './map-arguments'
import Container from '../.utils/container'

class ViewEvent {
    constructor(runtime, options, methods) {
        this.runtime = runtime || {}

        this.type = options.type
        this.args = mapArguments(
            runtime.view,
            options.args,
            methods
        )
        this.cachedValues = []
        this.publisher = this.publisher.bind(this)
        this.subscribers = new Container(null,
            () => this.addEventPublisher(),
            () => this.removeEventPublisher()
        )
    }

    publisher(forceUpdate) {
        const length = this.subscribers.length
        const values = this.args()

        if (forceUpdate !== true && values !== null) {
            let shouldUpdate = values.some((value, index) => {
                return this.cachedValues[index] !== value
            })
            this.cachedValues = values
            if (!shouldUpdate) {
                return false
            }
        }

        this.subscribers.forEach(subscriber => {
            subscriber.apply(null, values)
        })
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
