import isEqualArray from '../src/.utils/is-equal-array'

it('should handle falsy values', () => {
    expect(isEqualArray()).toBe(true)
    expect(isEqualArray(null)).toBe(true)
    expect(isEqualArray(null, null)).toBe(true)
    expect(isEqualArray(null, null, 2)).toBe(true)
    expect(isEqualArray([], null)).toBe(true)
    expect(isEqualArray([1], null)).toBe(false)
})

it('should check array length', () => {
    expect(isEqualArray([1, 2, 3], [1, 2])).toBe(false)
    expect(isEqualArray([1, 2], [1, 2, 3])).toBe(false)
})

it('should iterate over items', () => {
    expect(isEqualArray([1, 2], [1, 2])).toBe(true)
    expect(isEqualArray([1, 2], [1, 3])).toBe(false)
})

it('should handle offset', () => {
    expect(isEqualArray(['a', 1, 2], ['b', 1, 2], 1)).toBe(true)
})
