function createSubscribers(addEventListener, removeEventListener) {

    const addPublisher = ({ type, publisher }) => {
        type.forEach(name => addEventListener(name, publisher))
    }

    const removePublisher = ({ type, publisher }) => {
        type.forEach(name => removeEventListener(name, publisher))
    }

    return {
        add: (event, fn) => {
            let index = event.subscribers.indexOf(fn)
            if (index === -1) {
                event.subscribers.push(fn)
                if (event.subscribers.length === 1) {
                    addPublisher(event)
                }
            }
        },

        remove: (event, fn) => {
            let index = event.subscribers.indexOf(fn)
            if (index > -1) {
                event.subscribers.splice(index, 1)
                if (!event.subscribers.length) {
                    removePublisher(event)
                }
            }
        },

        removeAll: event => {
            event.subscribers = []
            removePublisher(event)
        } 
    }
}

export default createSubscribers
