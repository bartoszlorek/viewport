import makeCreateEvent from '../src/.internal/create-event'

const view = {
    document: null
}
const schema = {
    type: ['resize', 'scroll'],
    args: ['width', 'height']
}
const methods = {
    width: jest.fn(() => 800),
    height: jest.fn(() => 600)
}

describe('creation', () => {
    it('should return function that returns object with methods', () => {
        const createEvent = makeCreateEvent()
        const event = createEvent(schema, methods)

        expect(createEvent).toBeInstanceOf(Function)
        expect(event).toEqual(
            expect.objectContaining({
                type: ['resize', 'scroll'],
                subscribers: [],
                publisher: expect.any(Function),
                add: expect.any(Function),
                remove: expect.any(Function),
                removeAll: expect.any(Function)
            })
        )
    })
})

describe('.publisher', () => {
    const createEvent = makeCreateEvent(view)

    it('should loop over subscribers with cache', () => {
        const event = createEvent(schema, methods)
        const subA = jest.fn()
        const subB = jest.fn()

        event.subscribers = [subA, subB]
        event.publisher()
        event.publisher()
        event.publisher()

        expect(subA).toHaveBeenCalledWith(800, 600)
        expect(subB).toHaveBeenCalledWith(800, 600)

        expect(subA).toHaveBeenCalledTimes(1)
        expect(subB).toHaveBeenCalledTimes(1)
    })

    it('should loop over subscribers without cache (force update)', () => {
        const event = createEvent(schema, methods)
        const subA = jest.fn()
        const subB = jest.fn()

        event.subscribers = [subA, subB]
        event.publisher(true)
        event.publisher(true)
        event.publisher(true)

        expect(subA).toHaveBeenCalledWith(800, 600)
        expect(subB).toHaveBeenCalledWith(800, 600)

        expect(subA).toHaveBeenCalledTimes(3)
        expect(subB).toHaveBeenCalledTimes(3)
    })

    it('should loop over subscribers and update cache', () => {
        let counter = 0
        const dynamicMethods = {
            width: jest.fn(() => 800 + counter++),
            height: jest.fn(() => 600 + counter++)
        }
        const event = createEvent(schema, dynamicMethods)
        const subA = jest.fn()
        const subB = jest.fn()

        event.subscribers = [subA, subB]
        event.publisher()
        event.publisher()
        event.publisher()

        expect(subA.mock.calls).toEqual([[800, 601], [802, 603], [804, 605]])
        expect(subB.mock.calls).toEqual([[800, 601], [802, 603], [804, 605]])
    })
})

describe('.add', () => {
    it('should add event subscriber', () => {
        const createEvent = makeCreateEvent(view, () => {})
        const event = createEvent(schema, methods)
        event.add('a')
        event.add('b')
        event.add('c')
        expect(event.subscribers).toEqual(['a', 'b', 'c'])
    })

    it('should add publishers after first subscriber', () => {
        const addPublisher = jest.fn()
        const createEvent = makeCreateEvent(view, addPublisher)
        const event = createEvent(schema, methods)

        event.add('a')
        expect(addPublisher).toBeCalledWith(event)
        event.add('b')
        event.add('c')
        expect(addPublisher).toHaveBeenCalledTimes(1)
        expect(event.subscribers).toEqual(['a', 'b', 'c'])
    })
})

describe('.remove', () => {
    it('should remove event subscriber', () => {
        const createEvent = makeCreateEvent(view)
        const event = createEvent(schema, methods)
        event.subscribers = ['a', 'b', 'c']
        event.remove('b')
        expect(event.subscribers).toEqual(['a', 'c'])
    })

    it('should remove publishers after last subscriber', () => {
        const removePublisher = jest.fn()
        const createEvent = makeCreateEvent(view, () => {}, removePublisher)
        const event = createEvent(schema, methods)
        event.subscribers = ['a', 'b', 'c']

        event.remove('b')
        expect(event.subscribers).toEqual(['a', 'c'])
        expect(removePublisher).toHaveBeenCalledTimes(0)

        event.remove('c')
        expect(event.subscribers).toEqual(['a'])
        expect(removePublisher).toHaveBeenCalledTimes(0)

        event.remove('a')
        expect(event.subscribers).toEqual([])
        expect(removePublisher).toHaveBeenCalledTimes(1)
        expect(removePublisher).toBeCalledWith(event)
    })
})

describe('.removeAll', () => {
    it('should remove all event subscribers', () => {
        const createEvent = makeCreateEvent(view, null, () => {})
        const event = createEvent(schema, methods)
        event.subscribers = ['a', 'b', 'c']
        event.removeAll()
        expect(event.subscribers).toEqual([])
    })

    it('should remove publishers after last subscriber', () => {
        const removePublisher = jest.fn()
        const createEvent = makeCreateEvent(view, null, removePublisher)
        const event = createEvent(schema, methods)
        event.subscribers = ['a', 'b', 'c']
        event.removeAll()
        expect(event.subscribers).toEqual([])
        expect(removePublisher).toHaveBeenCalledTimes(1)
        expect(removePublisher).toBeCalledWith(event)
    })
})
