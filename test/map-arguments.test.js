import mapArguments from '../src/.internal/map-arguments'

it('should return function that returns null', () => {
    const exec = mapArguments()
    expect(exec).toBeInstanceOf(Function)
    expect(exec()).toBe(null)
})

it('should return function that returns array', () => {
    const exec = mapArguments(null, [])
    expect(exec).toBeInstanceOf(Function)
    expect(exec()).toEqual([])
})

it('should map arguments to methods', () => {
    const view = { document: null }
    const args = ['width', 'height']
    const methods = {
        width: jest.fn(() => 800),
        height: jest.fn(() => 600),
        top: jest.fn(() => 10)
    }
    const exec = mapArguments(view, args, methods)
    expect(exec()).toEqual([800, 600])

    expect(methods.width).toHaveBeenCalledTimes(1)
    expect(methods.width).toBeCalledWith(view, null)

    expect(methods.height).toHaveBeenCalledTimes(1)
    expect(methods.height).toBeCalledWith(view, null)

    expect(methods.top).toHaveBeenCalledTimes(0)
})
