import { useEntity } from './entity.js'
import { internalState } from './internal.js'

export function entityPrimaryValue (entity) {
  if (entity instanceof useEntity) {
    const state = entity[internalState]
    const primaryKey = state.definition.primaryKey
    return entity[primaryKey]
  }
}
