import { useEntity } from './entity.js'
import { useEntityCollection } from './entity-collection.js'
import { internalState } from './internal.js'

export function entityData (
  entity,
  {
    depth,
    withoutDetails = false,
    withoutChildren = false
  } = {},
  level = 0
) {
  const entityState = entity?.[internalState]

  if (entity instanceof useEntity) {
    const entries = []

    for (const key in entityState.properties) {
      if (entityState.properties[key]) {
        entries.push([key, entityState.properties[key].value])
      }
    }

    if (!withoutDetails) {
      for (const key in entityState.details) {
        const detail = entityState.details[key]
        if (detail != null) {
          entries.push([key, JSON.parse(JSON.stringify(detail))])
        }
      }
    }

    if (!withoutChildren && (typeof depth !== 'number' || level < depth)) {
      for (const key in entityState.children) {
        entries.push([
          key,
          entityData(entityState.children[key], { depth, withoutDetails, withoutChildren }, level + 1)
        ])
      }
    }

    return Object.fromEntries(entries)
  }

  if (entity instanceof useEntityCollection) {
    return entityState.entities.value.map(child =>
      entityData(child, { depth, withoutDetails, withoutChildren }, level)
    )
  }
}
