import { internalState } from './internal.js'

export function entityRoot (entity) {
  return entity?.[internalState]?.root
}

export function entityParent (entity) {
  return entity?.[internalState]?.parent
}

export function entityBase (entity) {
  return entity?.[internalState]?.base
}
