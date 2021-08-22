import { requestGet } from './odata.js'

export async function requestDetail ({ endPoint, properties, orderby, filter, pageSize, currentPage }) {
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
  })

  response.value = parseDataProperties(properties, response.value)

  return response
}

export async function loadAggregatedData ({ endPoint, groupedProperties, properties, orderby, filter }) {
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

  const response = await requestGet(endPoint, {
    $apply,
    $orderby
  })

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

export function isPathMultiple (path) {
  return path.split('/').some(step => step[0] === '*')
}

export function getValueFromPath (path, entity) {
  if (typeof path === 'string') {
    if (isPathMultiple(path)) {
      const steps = path.split('/')
      const stepMultiple = steps.findIndex(step => step[0] === '*')
      const stepsToArray = steps.splice(0, stepMultiple + 1)
      stepsToArray[stepMultiple] = stepsToArray[stepMultiple].substr(1)

      let level = entity
      while (level && stepsToArray.length > 0) {
        level = level[stepsToArray.shift()]
      }

      if (steps.length === 0) {
        return level
      } else {
        return level.map(root => {
          const localSteps = [...steps]
          let current = root
          while (current && localSteps.length > 0) {
            current = current[localSteps.shift()]
          }
          return current
        })
      }
    } else {
      const steps = path.split('/')
      let level = entity
      while (level && steps.length > 0) {
        level = level[steps.shift()]
      }
      return level
    }
  }
  return undefined
}

export function parsePropertiesFromPath (property, entity) {
  if (isPathMultiple(property.path)) {
    const steps = property.path.split('/')
    const stepMultiple = steps.findIndex(step => step[0] === '*')
    const stepsToArray = steps.splice(0, stepMultiple + 1)
    stepsToArray[stepMultiple] = stepsToArray[stepMultiple].substr(1)

    if (steps.length === 0) {
      let level = entity
      while (level && stepsToArray.length > 1) {
        level = level[stepsToArray.shift()]
      }
      const last = steps[0]
      level[last] = level[last].map(item => property.parse(item, property))
    } else {
      let level = entity
      while (level && stepsToArray.length > 0) {
        level = level[stepsToArray.shift()]
      }
      level.forEach(root => {
        const localSteps = [...steps]
        let current = root
        while (current && localSteps.length > 1) {
          current = current[localSteps.shift()]
        }
        const last = localSteps[0]
        current[last] = property.parse(current[last], property)
      })
    }
  } else {
    const steps = property.path.split('/')
    let level = entity
    while (level && steps.length > 1) {
      level = level[steps.shift()]
    }
    const last = steps[0]
    level[last] = property.parse(level[last], property)
  }
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

export function getOrderIcon (order, defaultValue = null) {
  if (order?.direction === 'asc') {
    return 'SortDown'
  }
  if (order?.direction === 'desc') {
    return 'SortUp'
  }
  return defaultValue
}
