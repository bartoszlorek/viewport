import createListener from '../src/.internal/create-listener'

describe('creation', () => {
    it('should return object with methods', () => {
        const listener = createListener()
        expect(listener).toEqual(
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
        const listener = createListener(() => {})
        listener.add(event, 'a')
        listener.add(event, 'b')
        listener.add(event, 'c')
        expect(event.subscribers).toEqual(['a', 'b', 'c'])
    })

    it('should add publishers after first subscriber', () => {
        const event = {
            type: ['scroll', 'resize'],
            publisher: 'publisher',
            subscribers: []
        }
        const addEventListener = jest.fn()
        const listener = createListener(addEventListener)

        listener.add(event, 'a')
        expect(event.subscribers).toEqual(['a'])
        expect(addEventListener.mock.calls).toEqual([
            ['scroll', 'publisher'],
            ['resize', 'publisher']
        ])
        listener.add(event, 'b')
        expect(event.subscribers).toEqual(['a', 'b'])
        listener.add(event, 'c')
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
        const listener = createListener(null, () => {})
        listener.remove(event, 'b')
        expect(event.subscribers).toEqual(['a', 'c'])
    })

    it('should remove publishers after last subscriber', () => {
        const event = {
            type: ['scroll', 'resize'],
            publisher: 'publisher',
            subscribers: ['a', 'b', 'c']
        }
        const removeEventListener = jest.fn()
        const listener = createListener(null, removeEventListener)

        listener.remove(event, 'b')
        expect(event.subscribers).toEqual(['a', 'c'])
        expect(removeEventListener).toHaveBeenCalledTimes(0)

        listener.remove(event, 'c')
        expect(event.subscribers).toEqual(['a'])
        expect(removeEventListener).toHaveBeenCalledTimes(0)

        listener.remove(event, 'a')
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
        const listener = createListener(null, () => {})
        listener.removeAll(event)
        expect(event.subscribers).toEqual([])
    })

    it('should remove publishers after last subscriber', () => {
        const event = {
            type: ['scroll', 'resize'],
            publisher: 'publisher',
            subscribers: ['a', 'b', 'c']
        }
        const removeEventListener = jest.fn()
        const listener = createListener(null, removeEventListener)

        listener.removeAll(event)
        expect(event.subscribers).toEqual([])
        expect(removeEventListener).toHaveBeenCalledTimes(2)
        expect(removeEventListener.mock.calls).toEqual([
            ['scroll', 'publisher'],
            ['resize', 'publisher']
        ])
    })
})
