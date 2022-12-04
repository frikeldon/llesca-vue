import { useEntity } from './entity.js'
import { useEntityCollection } from './entity-collection.js'
import { internalState } from './internal.js'

export function entitySyncData (entity, data) {
  const state = entity?.[internalState]

  if (entity instanceof useEntity) {
    for (const key in entity) {
      entity[key] = undefined
    }

    if (typeof data === 'object') {
      for (const key in data) {
        entity[key] = data[key]
      }
    }

    return true
  }

  if (entity instanceof useEntityCollection) {
    const newEntities = state.newEntities.splice(0, state.newEntities.length)
    for (const entity of newEntities) {
      entity[internalState].scope.stop()
    }

    state.deletedIndices.clear()
    for (let index = 0; index < state.storedEntities.length; index += 1) {
      state.deletedIndices.add(index)
    }

    if (Array.isArray(data)) {
      const { primaryKey } = state.definition
      const remainingData = Array.from(data)

      for (let index = 0; index < state.storedEntities.length; index += 1) {
        const entity = state.storedEntities[index]
        const primaryValue = entity[primaryKey]
        const dataIndex = remainingData.findIndex(data => data[primaryKey] === primaryValue)

        if (dataIndex > -1) {
          const [data] = remainingData.splice(dataIndex, 1)
          entitySyncData(entity, data)
          state.deletedIndices.delete(index)
        }
      }

      for (const data of remainingData) {
        entity.add(data)
      }
    }

    return true
  }

  return false
}
