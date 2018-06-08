function Container(items, loaded, unloaded) {
    this.items = items != null ? [...items] : []
    this.loaded = loaded || null
    this.unloaded = unloaded || null
}

Container.prototype = {
    get length() {
        return this.items.length
    },

    add: function(item) {
        let index = this.items.indexOf(item)
        if (index === -1) {
            this.items.push(item)
            if (this.loaded && this.items.length === 1) {
                this.loaded(this)
            }
        }
    },

    remove: function(item) {
        let index = this.items.indexOf(item)
        if (index > -1) {
            this.items.splice(index, 1)
            if (this.unloaded && !this.items.length) {
                this.unloaded(this)
            }
        }
    },

    empty: function() {
        this.items = []
        if (this.unloaded) {
            this.unloaded(this)
        }
    },

    forEach: function(iteratee) {
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
