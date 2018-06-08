class Container {
    constructor(loaded, unloaded) {
        this.items = []
        this.loaded = loaded || null
        this.unloaded = unloaded || null
    }

    get length() {
        return this.items.length
    }

    add(item) {
        let index = this.items.indexOf(item)
        if (index === -1) {
            this.items.push(item)
            if (this.loaded && this.items.length === 1) {
                this.loaded(this)
            }
        }
    }

    remove(item) {
        let index = this.items.indexOf(item)
        if (index > -1) {
            this.items.splice(index, 1)
            if (this.unloaded && !this.items.length) {
                this.unloaded(this)
            }
        }
    }

    empty() {
        this.items = []
        if (this.unloaded) {
            this.unloaded(this)
        }
    }

    forEach(iteratee) {
        let index = -1
        const length = this.items.length
        while (++index < length) {
            if (iteratee(this.items[index], index, this.items) === false) {
                return
            }
        }
    }
}

export default Container
