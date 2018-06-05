export default {
    width: () => (
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
    ),
    height: () => (
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
    ),
    scrollX: () => (
        window.scrollX || window.pageXOffset
    ),
    scrollY: () => (
        window.scrollY || window.pageYOffset
    )
}