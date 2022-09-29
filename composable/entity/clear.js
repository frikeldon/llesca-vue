import { useEntity } from './entity.js'
import { useEntityCollection } from './entity-collection.js'
import { internalState } from './internal.js'

export function entityClear (entity) {
  const state = entity?.[internalState]

  if (entity instanceof useEntity) {
    for (const key in state.storedProperties) {
      delete state.storedProperties[key]
    }

    for (const key in state.changedProperties) {
      delete state.changedProperties[key]
    }

    for (const key in state.children) {
      entityClear(state.children[key])
    }

    for (const key in state.details) {
      delete state.details[key]
    }

    return true
  }

  if (entity instanceof useEntityCollection) {
    state.storedEntities.splice(0, state.storedEntities.length)
      .forEach(entity => entity[internalState].scope.stop())

    state.newEntities.splice(0, state.newEntities.length)
      .forEach(entity => entity[internalState].scope.stop())

    state.deletedIndices.clear()

    return true
  }

  return false
}
