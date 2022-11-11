import { requestDelete } from '../../utils/odata.js'
import { useEntity } from './entity.js'
import { internalState } from './internal.js'

export async function entityDelete (entity, apiUrl, headers) {
  if (entity instanceof useEntity) {
    const state = entity[internalState]
    state.scope.stop()

    if (state.base) {
      return entityDelete(state.base, apiUrl, headers)
    }

    const { entityName, primaryKey } = state.definition
    const primaryValue = entity[primaryKey]

    if (primaryValue != null) {
      await requestDelete([apiUrl, null, `${entityName}(${primaryValue})`], null, headers)

      if (state.parent) {
        const parentState = state.parent[internalState]

        const storedIndex = parentState.storedEntities.indexOf(entity)
        if (storedIndex > -1) {
          parentState.storedEntities.splice(storedIndex, 1)
          parentState.deletedIndices.delete(storedIndex)

          const indices = Int32Array.from(parentState.deletedIndices)
            .filter(index => index > storedIndex)
            .sort()
          for (const currentIndex of indices) {
            parentState.deletedIndices.delete(currentIndex)
            parentState.deletedIndices.add(currentIndex - 1)
          }
        }

        const newIndex = parentState.newEntities.indexOf(entity)
        if (newIndex > -1) {
          parentState.newEntities.splice(newIndex, 1)
        }
      }

      return true
    }
  }

  return false
}
