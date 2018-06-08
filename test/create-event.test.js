import makeCreateEvent from '../src/.internal/create-event'

const options = {
    type: ['resize', 'scroll'],
    args: ['width', 'height']
}
const methods = {
    width: () => 800,
    height: () => 600
}

describe('creation', () => {
    const runtime = {
        view: { document: null },
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
    }
    const createEvent = makeCreateEvent(runtime)
    const event = createEvent(options, methods)

    it('should return function that returns object with methods', () => {
        expect(createEvent).toBeInstanceOf(Function)
        expect(event).toEqual(
            expect.objectContaining({
                type: ['resize', 'scroll'],
                subscribers: expect.any(Object),
                publisher: expect.any(Function)
            })
        )
    })

    it('should add listener after first subscriber', () => {
        event.subscribers.add('a')
        expect(event.subscribers.length).toBe(1)
        expect(runtime.addEventListener.mock.calls).toEqual([
            [runtime.view, 'resize', expect.any(Function)],
            [runtime.view, 'scroll', expect.any(Function)]
        ])
    })

    it('should remove listener after last subscriber', () => {
        event.subscribers.remove('a')
        expect(event.subscribers.length).toBe(0)
        expect(runtime.removeEventListener.mock.calls).toEqual([
            [runtime.view, 'resize', expect.any(Function)],
            [runtime.view, 'scroll', expect.any(Function)]
        ])
    })
})

describe('.publisher', () => {
    const runtime = {
        view: { document: null },
        addEventListener: () => {},
        removeEventListener: () => {}
    }
    const createEvent = makeCreateEvent(runtime)

    it('should loop over subscribers with cache', () => {
        const event = createEvent(options, methods)
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
        const event = createEvent(options, methods)
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
        const event = createEvent(options, dynamicMethods)
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
