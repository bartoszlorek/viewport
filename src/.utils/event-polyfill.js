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

export function dispatchEvent(elem, eventType) {
    if (elem == null) {
        return
    }
    if (typeof Event === 'function') {
        elem.dispatchEvent(new Event(eventType))
    } else if (elem.document) {
        let event = elem.document.createEvent('UIEvents')
        event.initUIEvent(eventType, true, false, elem, 0)
        elem.dispatchEvent(event)
    }
}
