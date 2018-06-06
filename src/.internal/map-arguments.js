function mapArguments(view, args, methods) {
    if (args != null) {
        return () => args.map(arg => methods[arg](view, view.document))
    }
    return () => null
}

export default mapArguments
