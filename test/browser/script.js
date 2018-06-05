;(function() {
    const viewport = createViewport()
    console.log(viewport)

    const handleScroll = (scrollX, scrollY) => console.log(scrollX, scrollY)
    const handleResize = (width, height) => console.log(width, height)

    viewport.on('scroll', handleScroll)
    viewport.on('resize', handleResize)

    document.onkeydown = event => {
        switch (event.code) {
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
