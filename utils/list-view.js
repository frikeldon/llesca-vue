import { requestGet } from './odata.js'
import { parseDataProperties } from './properties.js'

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
