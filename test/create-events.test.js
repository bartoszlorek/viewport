import createEvents from '../src/.internal/create-events'

const view = {
    document: null
}
const schema = {
    resize: {
        type: ['resize'],
        args: ['width', 'height']
    }
}
const methods = {
    width: jest.fn(() => 800),
    height: jest.fn(() => 600)
}

it('should create components for each event', () => {
    const events = createEvents(view, schema, methods)
    expect(events).toEqual(
        expect.objectContaining({
            resize: {
                type: ['resize'],
                subscribers: [],
                publisher: expect.any(Function)
            }
        })
    )
})

it('should loop over subscribers with cache', () => {
    const events = createEvents(view, schema, methods)
    const subA = jest.fn()
    const subB = jest.fn()

    events.resize.subscribers = [subA, subB]
    events.resize.publisher()
    events.resize.publisher()
    events.resize.publisher()

    expect(subA).toHaveBeenCalledWith(800, 600)
    expect(subB).toHaveBeenCalledWith(800, 600)

    expect(subA).toHaveBeenCalledTimes(1)
    expect(subB).toHaveBeenCalledTimes(1)
})

it('should loop over subscribers without cache (force update)', () => {
    const events = createEvents(view, schema, methods)
    const subA = jest.fn()
    const subB = jest.fn()

    events.resize.subscribers = [subA, subB]
    events.resize.publisher(true)
    events.resize.publisher(true)
    events.resize.publisher(true)

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
    const events = createEvents(view, schema, dynamicMethods)
    const subA = jest.fn()
    const subB = jest.fn()

    events.resize.subscribers = [subA, subB]
    events.resize.publisher()
    events.resize.publisher()
    events.resize.publisher()

    expect(subA.mock.calls).toEqual([[800, 601], [802, 603], [804, 605]])
    expect(subB.mock.calls).toEqual([[800, 601], [802, 603], [804, 605]])
})
