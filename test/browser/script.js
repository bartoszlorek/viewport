;(function() {
    const viewport = createViewport()
    console.log(viewport)
    console.log(viewport.width())

    const handleScroll = (event, scrollX, scrollY) => {
        console.log(event, scrollX, scrollY)
    }
    const handleResize = (event, width, height) => {
        console.log(event, width, height)
    }

    viewport.on('scroll', handleScroll)
    viewport.on('resize', handleResize)

    viewport.on('load', event => {
        console.log(event)
    })
    // viewport.on('unload', event => {
    //     return 'are you sure?'
    // })

    document.onkeydown = event => {
        event.preventDefault()
        switch (event.code) {
            case 'Space':
                viewport.trigger('resize')
                break
            case 'Enter':
                viewport.on('scroll', handleScroll)
                viewport.on('resize', handleResize)
                break
            case 'Delete':
                viewport.off('scroll', handleScroll)
                viewport.off('resize', handleResize)
                break
        }
    }
})()
