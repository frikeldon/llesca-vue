import { getCurrentScope, effectScope, shallowReactive, reactive, computed } from 'vue'
import { useEntityCollection } from './entity-collection.js'
import { internalState } from './internal.js'
import { entitySyncData } from './sync-data.js'

const FLAG_SKIP = '__v_skip'
const FLAG_RAW = '__v_raw'

export function useEntity (
  definition,
  {
    scope: parentScope = getCurrentScope(),
    root,
    parent,
    base
  } = {}
) {
  const target = parentScope.run(() => {
    const scope = effectScope()
    return scope.run(() => ({
      scope,
      definition,
      storedProperties: shallowReactive({}),
      changedProperties: shallowReactive({}),
      properties: null,
      children: null,
      details: reactive({}),
      root,
      parent,
      base
    }))
  })

  const entity = new Proxy(target, handler)

  target.properties = Object.fromEntries(
    (definition.keys || []).map(key => [
      key,
      target.scope.run(() => computed({
        get () {
          return key in target.changedProperties
            ? target.changedProperties[key]
            : target.storedProperties[key]
        },
        set (value) {
          if (target.storedProperties[key] === value) {
            delete target.changedProperties[key]
          } else {
            target.changedProperties[key] = value
          }
        }
      }))
    ])
  )

  target.children = Object.fromEntries(
    (definition.children || []).map(child => [
      child.navigationKey || child.entityName,
      useEntityCollection(child, {
        scope: target.scope,
        root: root ?? entity,
        parent: entity
      })
    ])
  )

  entity[internalState].root = root ?? entity

  return entity
}

const handler = {
  get (target, property, receiver) {
    if (property === internalState) {
      return target
    }

    if (property === FLAG_SKIP) {
      return true
    }

    if (property === FLAG_RAW) {
      return false
    }

    if (typeof property === 'string') {
      if (property in target.properties) {
        return target.properties[property].value
      }

      if (property in target.children) {
        return target.children[property]
      }
    }

    return target.details[property]
  },
  set (target, property, value, receiver) {
    if (
      property === internalState ||
      property === FLAG_SKIP ||
      property === FLAG_RAW
    ) {
      return false
    }

    if (typeof property === 'string') {
      if (property in target.properties) {
        target.properties[property].value = value
        return true
      }

      if (property in target.children) {
        return entitySyncData(target.children[property], value)
      }
    }

    if (value === undefined) {
      delete target.details[property]
    } else {
      target.details[property] = value
    }
    return true
  },
  has (target, property) {
    return property in target.properties ||
      property in target.children ||
      property in target.details
  },
  ownKeys (target) {
    return Object.keys(target.properties)
      .concat(Object.keys(target.children))
      .concat(Object.keys(target.details))
  },
  getOwnPropertyDescriptor (target, property) {
    if (
      property in target.properties ||
      property in target.children ||
      property in target.details
    ) {
      return { configurable: true, enumerable: true }
    }
  },
  getPrototypeOf (target) {
    return useEntity.prototype
  }
}
