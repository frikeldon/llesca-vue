import { requestGet } from './odata.js'
import { parseDataProperties, aggregatedName } from './properties.js'

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
