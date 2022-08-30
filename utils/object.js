function entriesWithSymbols (object) {
  return Object.entries(object).concat(
    Object.getOwnPropertySymbols(object).map(
      symbol => [symbol, object[symbol]]
    )
  )
}

export function clone (object) {
  if (object instanceof Date) {
    return new Date(object.getTime())
  } else if (Array.isArray(object)) {
    return object.map(item => clone(item))
  } else if (object && typeof object === 'object') {
    return Object.setPrototypeOf(
      Object.fromEntries(
        entriesWithSymbols(object).map(
          ([name, value]) => [name, clone(value)]
        )
      ),
      Object.getPrototypeOf(object)
    )
  } else {
    return object
  }
}
