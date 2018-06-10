# viewport
```javascript
const viewport = createViewport(view = window) // parameter is optional
```

## Events
Available `events` with their `arguments`.
```javascript
load    [event]
unload  [event]
resize  [event, width, height]
scroll  [event, x, y]
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

viewport.on('resize', (event, width, height) => {
  console.log(width, height)  // 800, 400
})

viewport.on('scroll', (event, x) => {
  console.log(x)  // 200
})

viewport.on('unload', () => {
  return 'are you sure?'
})

console.log(viewport.width())  // 800
```
