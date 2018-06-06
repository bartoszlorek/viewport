import createSubscribers from '../src/.internal/create-subscribers'

describe('creation', () => {
    it('should return object with methods', () => {
        const subscribers = createSubscribers()
        expect(subscribers).toEqual(
            expect.objectContaining({
                add: expect.any(Function),
                remove: expect.any(Function),
                removeAll: expect.any(Function)
            })
        )
    })
})

describe('.add', () => {
    it('should add event subscriber', () => {
        const event = {
            type: [],
            publisher: null,
            subscribers: []
        }
        const subscribers = createSubscribers(() => {})
        subscribers.add(event, 'a')
        subscribers.add(event, 'b')
        subscribers.add(event, 'c')
        expect(event.subscribers).toEqual(['a', 'b', 'c'])
    })

    it('should add publishers after first subscriber', () => {
        const event = {
            type: ['scroll', 'resize'],
            publisher: 'publisher',
            subscribers: []
        }
        const addEventListener = jest.fn()
        const subscribers = createSubscribers(addEventListener)

        subscribers.add(event, 'a')
        expect(event.subscribers).toEqual(['a'])
        expect(addEventListener.mock.calls).toEqual([
            ['scroll', 'publisher'],
            ['resize', 'publisher']
        ])
        subscribers.add(event, 'b')
        expect(event.subscribers).toEqual(['a', 'b'])
        subscribers.add(event, 'c')
        expect(event.subscribers).toEqual(['a', 'b', 'c'])
    })
})

describe('.remove', () => {
    it('should remove event subscriber', () => {
        const event = {
            type: [],
            publisher: null,
            subscribers: ['a', 'b', 'c']
        }
        const subscribers = createSubscribers(null, () => {})
        subscribers.remove(event, 'b')
        expect(event.subscribers).toEqual(['a', 'c'])
    })

    it('should remove publishers after last subscriber', () => {
        const event = {
            type: ['scroll', 'resize'],
            publisher: 'publisher',
            subscribers: ['a', 'b', 'c']
        }
        const removeEventListener = jest.fn()
        const subscribers = createSubscribers(null, removeEventListener)

        subscribers.remove(event, 'b')
        expect(event.subscribers).toEqual(['a', 'c'])
        expect(removeEventListener).toHaveBeenCalledTimes(0)

        subscribers.remove(event, 'c')
        expect(event.subscribers).toEqual(['a'])
        expect(removeEventListener).toHaveBeenCalledTimes(0)

        subscribers.remove(event, 'a')
        expect(event.subscribers).toEqual([])
        expect(removeEventListener).toHaveBeenCalledTimes(2)
        expect(removeEventListener.mock.calls).toEqual([
            ['scroll', 'publisher'],
            ['resize', 'publisher']
        ])
    })
})

describe('.removeAll', () => {
    it('should remove all event subscribers', () => {
        const event = {
            type: [],
            publisher: null,
            subscribers: ['a', 'b', 'c']
        }
        const subscribers = createSubscribers(null, () => {})
        subscribers.removeAll(event)
        expect(event.subscribers).toEqual([])
    })

    it('should remove publishers after last subscriber', () => {
        const event = {
            type: ['scroll', 'resize'],
            publisher: 'publisher',
            subscribers: ['a', 'b', 'c']
        }
        const removeEventListener = jest.fn()
        const subscribers = createSubscribers(null, removeEventListener)

        subscribers.removeAll(event)
        expect(event.subscribers).toEqual([])
        expect(removeEventListener).toHaveBeenCalledTimes(2)
        expect(removeEventListener.mock.calls).toEqual([
            ['scroll', 'publisher'],
            ['resize', 'publisher']
        ])
    })
})
