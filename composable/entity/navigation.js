import { useEntityCollection } from './entity-collection.js'
import { internalState } from './internal.js'

export function entityRoot (entity) {
  return entity?.[internalState]?.root
}

export function entityParent (entity, { includeCollections = false } = {}) {
  let parent = entity?.[internalState]?.parent
  if (!includeCollections) {
    while (parent instanceof useEntityCollection) {
      parent = entity?.[internalState]?.parent
    }
  }
  return parent
}

export function entityBase (entity) {
  return entity?.[internalState]?.base
}
