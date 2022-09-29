import { useEntity } from './entity.js'
import { useEntityCollection } from './entity-collection.js'
import { internalState } from './internal.js'

export function entitySyncState (target, source) {
  const targetState = target?.[internalState]
  const sourceState = source?.[internalState]

  if (
    target instanceof useEntity &&
    source instanceof useEntity &&
    targetState.definition === sourceState.definition
  ) {
    for (const key in targetState.storedProperties) {
      if (!(key in sourceState.storedProperties)) {
        delete targetState.storedProperties[key]
      }
    }
    for (const key in sourceState.storedProperties) {
      targetState.storedProperties[key] = sourceState.storedProperties[key]
    }

    for (const key in targetState.changedProperties) {
      if (!(key in sourceState.changedProperties)) {
        delete targetState.changedProperties[key]
      }
    }
    for (const key in sourceState.changedProperties) {
      targetState.changedProperties[key] = sourceState.changedProperties[key]
    }

    for (const key in sourceState.details) {
      targetState.details[key] = sourceState.details[key]
    }

    for (const key in sourceState.children) {
      entitySyncState(targetState.children[key], sourceState.children[key])
    }

    return true
  }

  if (
    target instanceof useEntityCollection &&
    source instanceof useEntityCollection &&
    targetState.definition === sourceState.definition
  ) {
    const targetState = target[internalState]
    const sourceState = source[internalState]

    targetState.storedEntities.splice(0, targetState.storedEntities.length)
      .forEach(entity => entity[internalState].scope.stop())

    for (const entity of sourceState.storedEntities) {
      const clone = target.create()
      entitySyncState(clone, entity)
      targetState.storedEntities.push(clone)
    }

    targetState.newEntities.splice(0, targetState.newEntities.length)
      .forEach(entity => entity[internalState].scope.stop())

    for (const entity of sourceState.newEntities) {
      const clone = target.create()
      entitySyncState(clone, entity)
      targetState.newEntities.push(clone)
    }

    targetState.deletedIndices.clear()
    for (const index of sourceState.deletedIndices.values()) {
      targetState.deletedIndices.add(index)
    }

    return true
  }

  return false
}
