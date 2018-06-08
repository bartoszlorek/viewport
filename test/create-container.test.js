import createContainer from '../src/.utils/create-container'

console.log(createContainer)

it('should return object with methods', () => {
    const container = createContainer('items')
    const a = Object.create(container)
    const b = Object.create(container)

    
    a.items = ['a']
    a.add('c')
    

    console.log(a.items, b.items)

    // expect(event).toEqual(
    //     expect.objectContaining({
    //         type: ['resize', 'scroll'],
    //         subscribers: [],
    //         publisher: expect.any(Function),
    //         add: expect.any(Function),
    //         remove: expect.any(Function),
    //         removeAll: expect.any(Function)
    //     })
    // )
})
