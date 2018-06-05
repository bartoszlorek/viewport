export default {
    load: {
        type: ['load']
    },
    unload: {
        type: ['beforeunload']
    },
    resize: {
        type: ['resize', 'scroll', 'orientationchange'],
        args: ['width', 'height']
    },
    scroll: {
        type: ['scroll'],
        args: ['scrollX', 'scrollY']
    }
}
