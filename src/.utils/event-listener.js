export function addEventListener(elem, event, fn) {
    if (elem == null) {
        return
    }
    if (elem.addEventListener) {
        elem.addEventListener(event, fn, false)
    } else {
        elem.attachEvent('on' + event, () => {
            return fn.call(elem, window.event)
        })
    }
}

export function removeEventListener(elem, event, fn) {
    if (elem == null) {
        return
    }
    if (elem.removeEventListener) {
        elem.removeEventListener(event, fn)
    } else {
        elem.detachEvent('on' + event, fn)
    }
}
