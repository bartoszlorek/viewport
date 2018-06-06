# viewport
```javascript
const viewport = createViewport(view = window) // parameter is optional
```

## Events
Available `events` with their `arguments`.
```javascript
load    []
unload  []
resize  [width, height]
scroll  [scrollX, scrollY]
```

```javascript
.on(name, fn)   // attach a handler function to the given event

.off()          // detach all handler functions
.off(name)      // detach all handler functions of the given event
.off(name, fn)  // detach given handler function

.trigger(name)  // execute all handlers attached to the given event
```

## Methods
```javascript
.width()        // returns width of the browser viewport
.height()       // returns height of the browser viewport
.scrollX()      // returns horizontal position of the viewport scroll bar
.scrollY()      // returns vertical position of the viewport scroll bar
```

## Examples
```javascript
import createViewport from 'viewport'
const viewport = createViewport()

viewport.on('resize', (width, height) => {
  console.log(width, height)
})

viewport.on('scroll', (scrollX) => {
  console.log(scrollX)
})

console.log(viewport.width())
```
