import { useEntity } from './entity.js'
import { useEntityCollection } from './entity-collection.js'
import { internalState } from './internal.js'

export function entityPrimaryValue (entity) {
  if (entity instanceof useEntity) {
    const state = entity[internalState]
    const primaryKey = state.definition.primaryKey
    return entity[primaryKey]
  }
}

export function entityDefinition (entity) {
  if (
    entity instanceof useEntity ||
    entity instanceof useEntityCollection
  ) {
    return entity[internalState].definition
  }
}

export function entityHasPendingChanges (
  entity,
  {
    depth,
    withoutChildren = false
  } = {},
  level = 0
) {
  const entityState = entity[internalState]

  if (entity instanceof useEntity) {
    if (Object.keys(entityState.changedProperties).length > 0) {
      return true
    }

    if (!withoutChildren && (typeof depth !== 'number' || level < depth)) {
      for (const key in entityState.children) {
        if (entityHasPendingChanges(entityState.children[key], { depth, withoutChildren }, level + 1)) {
          return true
        }
      }
    }
  } else if (entity instanceof useEntityCollection) {
    if (entityState.newEntities.length > 0 || entityState.deletedIndices.size > 0) {
      return true
    }

    for (const child of entityState.entities.value) {
      if (entityHasPendingChanges(child, { depth, withoutChildren }, level)) {
        return true
      }
    }
  }
  return false
}
