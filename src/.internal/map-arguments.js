function mapArguments(args, methods) {
    if (args != null) {
        return event => {
            let values = args.map(arg => {
                return methods[arg]()
            })
            values.unshift(event)
            return values
        }
    }
    return event => [event]
}

export default mapArguments
