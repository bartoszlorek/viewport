;(function() {
    var viewport = createViewport()
    console.log(viewport)
    console.log(viewport.width())

    var handleScroll = function(event, scrollX, scrollY) {
        console.log(event, scrollX, scrollY)
    }
    var handleResize = function(event, width, height) {
        console.log(event, width, height)
    }

    viewport.on('scroll', handleScroll)
    viewport.on('resize', handleResize)

    viewport.on('load', function(event) {
        console.log(event)
    })
    // viewport.on('unload', function (event) {
    //     return 'are you sure?'
    // })

    document.onkeydown = function(event) {
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
