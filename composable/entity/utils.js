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
