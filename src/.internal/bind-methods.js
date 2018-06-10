function bindMethods(view, methods) {
    let result = {}
    Object.keys(methods).forEach(name => {
        result[name] = () => methods[name](view, view.document)
    })
    return result
}

export default bindMethods
