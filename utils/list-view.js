import { requestGet } from './odata.js'

export async function requestDetail ({ endPoint, properties, orderby, filter, pageSize, currentPage, headers }) {
  const isPaginated = Number.isInteger(pageSize) && pageSize > 0

  const response = await requestGet(endPoint, {
    $select: properties
      .filter(property => property.$select)
      .map(property => property.$select)
      .join() || undefined,

    $expand: properties
      .filter(property => property.$expand)
      .map(property => property.$expand)
      .join() || undefined,

    $orderby: orderby
      ?.filter(order => ['asc', 'desc'].includes(order.direction))
      .map(order => `${order.sentence} ${order.direction}`)
      .join() || undefined,

    $filter: filter || undefined,

    $top: isPaginated ? pageSize : undefined,
    $skip: (isPaginated && (currentPage * pageSize)) || undefined,
    $count: isPaginated || undefined
  }, headers)

  response.value = parseDataProperties(properties, response.value)

  return response
}

export async function loadAggregatedData ({ endPoint, groupedProperties, properties, orderby, filter, pageSize, currentPage, headers }) {
  const groupby = groupedProperties
    .map(property => property.path || property.$select)
    .join()

  const aggregate = properties
    .map((property, index) => {
      switch (typeof property.aggregate) {
        case 'string':
          return `${property.aggregate} as ${aggregatedName(index)}`
        case 'object':
          return `${property.aggregate.expression} as ${aggregatedName(index)}`
        default:
          return undefined
      }
    })
    .filter(item => item)
    .join()

  const apply = groupby
    ? aggregate
      ? `groupby((${groupby}), aggregate(${aggregate}))`
      : `groupby((${groupby}))`
    : aggregate
      ? `aggregate(${aggregate})`
      : ''

  const $apply = filter
    ? apply
      ? `filter(${filter})/${apply}`
      : `filter(${filter})`
    : apply || undefined

  const $orderby = orderby
    ?.filter(order => ['asc', 'desc'].includes(order.direction))
    .map(order => `${order.sentence} ${order.direction}`)
    .join() || undefined

  const isPaginated = Number.isInteger(pageSize) && pageSize > 0

  const $top = isPaginated ? pageSize : undefined
  const $skip = (isPaginated && (currentPage * pageSize)) || undefined
  const $count = isPaginated || undefined

  const response = await requestGet(endPoint, {
    $apply,
    $orderby,
    $top,
    $skip,
    $count
  }, headers)

  parseDataProperties(groupedProperties, response.value)

  // parse aggregated properties
  for (let index = 0; index < properties.length; index += 1) {
    const property = properties[index]
    if (typeof property.aggregate === 'string') {
      if (property.parse) {
        const name = aggregatedName(index)
        for (const entity of response.value) {
          const value = entity[name]
          entity[name] = property.parse(value, property)
        }
      }
    } else if (typeof property.aggregate === 'object') {
      if (property.aggregate.parse) {
        const name = aggregatedName(index)
        for (const entity of response.value) {
          const value = entity[name]
          entity[name] = property.aggregate.parse(value, property)
        }
      }
    }
  }

  return response
}

export function getValueFromPath (path, entity) {
  if (!path || entity == null) {
    return entity
  }

  const separatorIndex = path.indexOf('/')
  if (separatorIndex === -1) {
    return entity[path]
  }

  const currentPath = path.substr(0, separatorIndex)
  const remainderPath = path.substr(separatorIndex + 1)
  const value = entity[currentPath]

  if (Array.isArray(value)) {
    return value.map(element => getValueFromPath(remainderPath, element))
  }

  return getValueFromPath(remainderPath, value)
}

export function parsePropertiesFromPath (property, entity, path = property.path) {
  const separatorIndex = path.indexOf('/')

  if (separatorIndex === -1) {
    entity[path] = property.parse(entity[path], property)
  }

  const currentPath = path.substr(0, separatorIndex)
  const remainderPath = path.substr(separatorIndex + 1)
  const value = entity[currentPath]

  if (Array.isArray(value)) {
    return value.map(element => parsePropertiesFromPath(property, element, remainderPath))
  }

  return getValueFromPath(remainderPath, value, remainderPath)
}

export function parseDataProperties (properties, data) {
  for (const property of properties) {
    if (property.parse) {
      if (property.$select) {
        for (const entity of data) {
          const value = entity[property.$select]
          entity[property.$select] = property.parse(value, property)
        }
      }
      if (property.$expand) {
        for (const entity of data) {
          parsePropertiesFromPath(property, entity)
        }
      }
    }
  }
  return data
}

export function aggregatedName (index) {
  return `aggregatedProperty${index}`
}

export function createRows (columns, data, { aggregate } = {}) {
  const rows = []
  for (const entity of data) {
    const row = []
    for (const column of columns) {
      if (aggregate && column.property.aggregate) {
        row.push(entity[aggregatedName(column.propertyIndex)])
      } else if (column.property.$expand) {
        row.push(getValueFromPath(column.property.path, entity))
      } else if (column.property.$select) {
        row.push(entity[column.property.$select])
      }
    }

    rows.push(row)
  }
  return rows
}

export function getOrderIcon (order, defaultOrder = null) {
  if ((order?.direction ?? defaultOrder) === 'asc') {
    return 'SortDown'
  }
  if ((order?.direction ?? defaultOrder) === 'desc') {
    return 'SortUp'
  }
  return null
}
