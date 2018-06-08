import Container from '../src/.utils/container'

describe('creation', () => {
    it('should return object with methods', () => {
        const container = new Container()
        expect(container).toEqual(
            expect.objectContaining({
                items: [],
                loaded: null,
                unloaded: null,

                length: 0,
                add: expect.any(Function),
                remove: expect.any(Function),
                empty: expect.any(Function),
                forEach: expect.any(Function)
            })
        )
    })

    it('should assign initial values', () => {
        const initial = ['a', 'b']
        const container = new Container(initial)
        expect(container.items).not.toBe(initial)
    })
})

describe('.add', () => {
    it('should add an item', () => {
        const container = new Container()
        container.add('a')
        container.add('b')
        container.add('c')
        expect(container.items).toEqual(['a', 'b', 'c'])
    })

    it('should call loaded callback after first item', () => {
        const loaded = jest.fn()
        const container = new Container([], loaded)
        expect(loaded).toHaveBeenCalledTimes(0)
        container.add('a')
        expect(loaded).toHaveBeenCalledTimes(1)
        expect(loaded).toBeCalledWith(container)
        container.add('b')
        container.add('c')
        expect(container.items).toEqual(['a', 'b', 'c'])
    })
})

describe('.remove', () => {
    it('should remove an item', () => {
        const container = new Container(['a', 'b', 'c'])
        container.remove('a')
        container.remove('b')
        expect(container.items).toEqual(['c'])
    })

    it('should call unloaded callback after last item', () => {
        const unloaded = jest.fn()
        const container = new Container(['a', 'b', 'c'], null, unloaded)

        container.remove('a')
        container.remove('b')
        expect(unloaded).toHaveBeenCalledTimes(0)
        container.remove('c')
        expect(unloaded).toHaveBeenCalledTimes(1)
        expect(unloaded).toBeCalledWith(container)
        expect(container.items).toEqual([])
    })
})

describe('.empty', () => {
    it('should remove all items', () => {
        const container = new Container(['a', 'b', 'c'])
        container.empty()
        expect(container.items).toEqual([])
    })

    it('should call unload callback', () => {
        const unloaded = jest.fn()
        const container = new Container(['a', 'b', 'c'], null, unloaded)

        expect(unloaded).toHaveBeenCalledTimes(0)
        container.empty()
        expect(unloaded).toHaveBeenCalledTimes(1)
        expect(unloaded).toBeCalledWith(container)
        expect(container.items).toEqual([])
    })
})

describe('.forEach', () => {
    it('should iterate over items', () => {
        const callback = jest.fn()
        const container = new Container(['a', 'b', 'c'])
        container.forEach(callback)
        expect(callback.mock.calls).toEqual([
            ['a', 0, container.items],
            ['b', 1, container.items],
            ['c', 2, container.items]
        ])
    })

    it('should stop after returning false', () => {
        const callback = jest.fn((item, index) => index < 1)
        const container = new Container(['a', 'b', 'c'])
        container.forEach(callback)
        expect(callback.mock.calls).toEqual([
            ['a', 0, container.items],
            ['b', 1, container.items]
        ])
    })
})
