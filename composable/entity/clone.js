import { entitySyncState } from './sync-state.js'
import { useEntity } from './entity.js'
import { internalState } from './internal.js'

export function entityClone (entity, { scope } = {}) {
  if (!(entity instanceof useEntity)) {
    throw new Error()
  }

  const entityState = entity[internalState]

  const clone = useEntity(entityState.definition, { scope, base: entity })
  entitySyncState(clone, entity)
  return clone
}
