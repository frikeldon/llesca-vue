import { ref } from 'vue'
import { requestGet } from '../../utils/odata.js'
import { useEntity } from './entity.js'
import { entitySyncData } from './sync-data.js'
import { entityClear } from './clear.js'
import { entityConsolidate } from './consolidate.js'
import { internalState } from './internal.js'

export async function entityLoad (entity, apiUrl, headers, id) {
  const response = await requestLoad(entity[internalState].definition, apiUrl, headers, id)
  entityClear(entity)
  entitySyncData(entity, response)
  entityConsolidate(entity)
  return response
}

export function useEntityFromId (definition, apiUrl, headers, id) {
  const loaded = ref(false)
  const entity = useEntity(definition)
  entityLoad(entity).then(() => { loaded.value = true })
  return { entity, loaded }
}

export async function entityLoadCollection (entityCollection, apiUrl, headers, getParams) {
  const response = await requestLoadCollection(entityCollection[internalState].definition, apiUrl, headers, getParams)
  entityClear(entityCollection)
  entitySyncData(entityCollection, response.value)
  entityConsolidate(entityCollection)
  return response
}

async function requestLoad (definition, apiUrl, headers, id) {
  const response = await requestGet(
    [apiUrl, `${definition.entityName}(${id})`],
    {
      $select: getKeyList(definition),
      $expand: getExpandQuery(definition)
    },
    headers
  )
  delete response['@odata.context']
  replaceDates(definition, response)
  return response
}

async function requestLoadCollection (definition, apiUrl, headers, getParams) {
  const response = await requestGet(
    [apiUrl, definition.entityName],
    {
      $select: getKeyList(definition),
      $expand: getExpandQuery(definition),
      ...getParams
    },
    headers
  )
  delete response['@odata.context']
  replaceDates(definition, response)
  return response
}

function getKeyList (entity) {
  if (Array.isArray(entity.keys) && entity.keys.length > 0) {
    return Array.isArray(entity.ignoredKeys) && entity.ignoredKeys.length > 0
      ? entity.keys.filter(key => !entity.ignoredKeys.includes(key)).join()
      : undefined
  }
}

function getExpandQuery (definition) {
  const expands = []

  const subentities = [
    ...(definition.children || []),
    ...(definition.details || [])
  ]

  for (const entity of subentities) {
    const navigation = entity.navigationKey || entity.entityName
    const subqueries = []
    const keyList = getKeyList(entity)
    if (keyList) {
      subqueries.push(`$select=${keyList}`)
    }
    if (entity.children?.length > 0 || entity.details?.length > 0) {
      subqueries.push(`$expand=${getExpandQuery(entity)}`)
    }

    if (subqueries.length > 0) {
      expands.push(`${navigation}(${subqueries.join(';')})`)
    } else {
      expands.push(navigation)
    }
  }

  return expands.length > 0
    ? expands.join()
    : undefined
}

function replaceDates (definition, data) {
  if (Array.isArray(definition.dateKeys)) {
    for (const key of definition.dateKeys) {
      if (typeof data[key] === 'string') {
        data[key] = new Date(data[key])
      }
    }
  }

  if (definition.children) {
    for (const childDefinition of definition.children) {
      const navigation = childDefinition.navigationKey || childDefinition.entityName
      if (Array.isArray(data[navigation])) {
        for (const childData of data[navigation]) {
          replaceDates(childDefinition, childData)
        }
      } else if (typeof data[navigation] === 'object') {
        replaceDates(childDefinition, data[navigation])
      }
    }
  }
}
