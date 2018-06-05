function mapArguments(args, methods) {
    if (args != null) {
        return () => args.map(a => methods[a]())
    }
    return () => null
}

export default mapArguments
