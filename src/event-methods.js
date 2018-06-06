export default {
    width: (win, doc) => (
        win.innerWidth ||
        doc.documentElement.clientWidth ||
        doc.body.clientWidth
    ),
    height: (win, doc) => (
        win.innerHeight ||
        doc.documentElement.clientHeight ||
        doc.body.clientHeight
    ),
    scrollX: (win, doc) => (
        win.scrollX || win.pageXOffset
    ),
    scrollY: (win, doc) => (
        win.scrollY || win.pageYOffset
    )
}