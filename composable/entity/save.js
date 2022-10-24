import { requestBatch } from '../../utils/odata.js'
import { useEntity } from './entity.js'
import { useEntityCollection } from './entity-collection.js'
import { entityData } from './data.js'
import { entityConsolidate } from './consolidate.js'
import { entitySyncData } from './sync-data.js'
import { entitySyncState } from './sync-state.js'
import { internalState } from './internal.js'

export async function entitySave (entity, apiUrl, headers) {
  if (entity instanceof useEntity) {
    const requests = entityBatchRequests(entity)

    if (requests.length > 0) {
      const responses = await requestBatch(apiUrl, requests, headers)
      assignResponseDataToEntity(entity, responses)
      entityConsolidate(entity)

      const state = entity[internalState]

      if (state.parent) {
        const parentState = state.parent[internalState]

        const newIndex = parentState.newEntities.indexOf(entity)
        if (newIndex > -1) {
          parentState.newEntities.splice(newIndex, 1)
          parentState.storedEntities.push(entity)
        }
      }

      if (state.base) {
        entitySyncState(state.base, entity)
      }
    }

    return true
  }

  return false
}

function entityBatchRequests (entity, prefix = '') {
  const state = entity[internalState]
  const { entityName, primaryKey } = state.definition

  if (entity instanceof useEntity) {
    const primaryValue = entity[primaryKey]

    if (primaryValue == null) {
      const body = entityData(entity, { withoutDetails: true })
      return [{
        atomicityGroup: 'entitySave',
        id: `${prefix}/create`,
        method: 'POST',
        url: entityName,
        body
      }]
    } else {
      const requests = []
      if (Object.keys(state.changedProperties).length > 0) {
        requests.push({
          atomicityGroup: 'entitySave',
          id: `${prefix}/update`,
          method: 'PATCH',
          url: `${entityName}(${primaryValue})`,
          body: { ...state.changedProperties }
        })
      }
      for (const childName in state.children) {
        requests.push(...entityBatchRequests(state.children[childName], `${prefix}/${childName}`))
      }
      return requests
    }
  }

  if (entity instanceof useEntityCollection) {
    const requests = []

    for (const index of state.deletedIndices) {
      const primaryValue = state.storedEntities[index][primaryKey]
      requests.push({
        atomicityGroup: 'entitySave',
        id: `${prefix}(${primaryValue})/delete`,
        method: 'DELETE',
        url: `${entityName}(${primaryValue})`
      })
    }

    for (let index = 0; index < state.entities.value.length; index += 1) {
      requests.push(...entityBatchRequests(state.entities.value[index], `${prefix}[${index}]`))
    }

    return requests
  }

  return []
}

function assignResponseDataToEntity (entity, responses) {
  for (const response of responses) {
    if (response.body) {
      const [, path] = response.id.match(/^(.*)\/(?:create|update|delete)$/)
      const target = traverseEntity(entity, path)
      const valuesWithDetails = {
        ...response.body,
        ...target[internalState].details
      }
      entitySyncData(target, valuesWithDetails)
    }
  }
}

function traverseEntity (entity, path) {
  if (!path) {
    return entity
  }

  const [match, navigation, index] = path.match(/^\/([^[]+)\[(\d+)]/)
  return traverseEntity(
    entity[navigation][index],
    path.substring(match.length)
  )
}
