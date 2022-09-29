import { useEntity } from './entity.js'
import { useEntityCollection } from './entity-collection.js'
import { internalState } from './internal.js'

export function entityConsolidate (entity) {
  const state = entity?.[internalState]

  if (entity instanceof useEntity) {
    const changedKeys = Object.keys(state.changedProperties)

    for (const key of changedKeys) {
      state.storedProperties[key] = state.changedProperties[key]
      delete state.changedProperties[key]
    }

    for (const key in state.children) {
      entityConsolidate(state.children[key])
    }

    return true
  }

  if (entity instanceof useEntityCollection) {
    const sortedIndices = Array.from(state.deletedIndices).sort().reverse()
    for (const index of sortedIndices) {
      const [deletedEntity] = state.storedEntities.splice(index, 1)
      deletedEntity[internalState].scope.stop()
    }

    state.deletedIndices.clear()

    const newEntities = state.newEntities.splice(0, state.newEntities.length)
    state.storedEntities.push(...newEntities)

    for (const entity of state.storedEntities) {
      entityConsolidate(entity)
    }

    return true
  }

  return false
}
