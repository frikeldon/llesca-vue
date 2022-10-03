import { getCurrentScope, shallowReactive, computed } from 'vue'
import { useEntity } from './entity.js'
import { entitySyncData } from './sync-data.js'
import { internalState } from './internal.js'

export function useEntityCollection (
  definition,
  {
    scope = getCurrentScope(),
    root,
    parent
  } = {}
) {
  const entityCollection = new Proxy(scope.run(() => {
    const storedEntities = shallowReactive([])
    const newEntities = shallowReactive([])
    const deletedIndices = shallowReactive(new Set())

    const remainingEntities = computed(() =>
      storedEntities.filter((_, index) => !deletedIndices.has(index))
    )
    const entities = computed(() => remainingEntities.value.concat(newEntities))

    return {
      scope,
      definition,
      storedEntities,
      newEntities,
      deletedIndices,
      remainingEntities,
      entities,
      root: root ?? entityCollection,
      parent
    }
  }), handler)
  return entityCollection
}

const handler = {
  get (target, property, receiver) {
    if (typeof property === 'string') {
      if (property in target.entities.value) {
        return target.entities.value[property]
      }

      if (property in collectionPrototype) {
        return collectionPrototype[property].bind(null, target, receiver)
      }
    }

    if (property === internalState) {
      return target
    }

    if (property === '__v_skip') {
      return true
    }
  },
  set (target, property, value, receiver) {
    if (
      typeof value === 'object' &&
      property !== 'length' &&
      property in target.entities.value
    ) {
      return entitySyncData(target.entities.value[property], value)
    }
    return false
  },
  has (target, property) {
    return Reflect.has(target.entities.value, property)
  },
  ownKeys (target) {
    return Reflect.ownKeys(target.entities.value)
  },
  getOwnPropertyDescriptor (target, property) {
    return Reflect.getOwnPropertyDescriptor(target.entities.value, property)
  },
  getPrototypeOf (target) {
    return useEntityCollection.prototype
  }
}

const collectionPrototype = {
  create (target, receiver) {
    return useEntity(target.definition, {
      scope: target.scope,
      root: target.root,
      parent: receiver
    })
  },
  add (target, receiver, value) {
    if (value instanceof useEntity && value[internalState].root === target.root) {
      target.newEntities.push(value)
      return value
    }

    const entity = useEntity(target.definition, {
      scope: target.scope,
      root: target.root,
      parent: receiver
    })
    entitySyncData(entity, value)
    target.newEntities.push(entity)
    return entity
  },
  delete (target, receiver, property) {
    if (property !== 'length' && property in target.entities.value) {
      const index = Number(property)
      if (index < target.remainingEntities.value.length) {
        const deletedEntity = target.remainingEntities.value[index]
        const storedIndex = target.storedEntities.indexOf(deletedEntity)
        target.deletedIndices.add(storedIndex)
      } else {
        const newEntitiesIndex = index - target.remainingEntities.value.length
        const [deletedEntity] = target.newEntities.splice(newEntitiesIndex, 1)
        deletedEntity[internalState].scope.stop()
      }
    }
  },
  // Array methods
  [Symbol.species] (target, receiver) { return Array },
  [Symbol.iterator] (target, receiver) {
    return target.entities.value.value()
  },
  at (target, receiver, index) {
    return target.entities.value.at(index)
  },
  concat (target, receiver, ...values) {
    return target.entities.value.concat(...values)
  },
  copyWithin () {
    throw new Error("'copyWithin' method is not available.")
  },
  entries (target, receiver) {
    return target.entities.value.entries()
  },
  every (target, receiver, callback, thisArg) {
    return target.entities.value.every(callback, thisArg)
  },
  fill () {
    throw new Error("'copyWithin' method is not available.")
  },
  filter (target, receiver, callback, thisArg) {
    return target.entities.value.filter(callback, thisArg)
  },
  find (target, receiver, callback, thisArg) {
    return target.entities.value.find(callback, thisArg)
  },
  findIndex (target, receiver, callback, thisArg) {
    return target.entities.value.findIndex(callback, thisArg)
  },
  findLast (target, receiver, callback, thisArg) {
    return target.entities.value.findLast(callback, thisArg)
  },
  findLastIndex (target, receiver, callback, thisArg) {
    return target.entities.value.findLastIndex(callback, thisArg)
  },
  flat (target, receiver, depth = 1) {
    throw new Error("'flat' method is not implemented yet.")
  },
  flatMap (target, receiver, callback, thisArg) {
    throw new Error("'flatMap' method is not implemented yet.")
  },
  forEach (target, receiver, callback, thisArg) {
    return target.entities.value.forEach(callback, thisArg)
  },
  includes (target, receiver, searchElement, fromIndex) {
    return target.entities.value.includes(searchElement, fromIndex)
  },
  indexOf (target, receiver, searchElement, fromIndex) {
    return target.entities.value.indexOf(searchElement, fromIndex)
  },
  join (target, receiver, separator = ',') {
    throw new Error("'join' method is not implemented yet.")
  },
  keys (target, receiver) {
    return target.entities.value.keys()
  },
  lastIndexOf (target, receiver, searchElement, fromIndex) {
    return target.entities.value.lastIndexOf(searchElement, fromIndex)
  },
  map (target, receiver, callback, thisArg) {
    return target.entities.value.map(callback, thisArg)
  },
  pop (target, receiver) {
    throw new Error("'pop' method is not implemented yet.")
  },
  push (target, receiver, ...items) {
    throw new Error("'push' method is not implemented yet.")
  },
  reduce (target, receiver, callback, initialValue) {
    return target.entities.value.reduce(callback, initialValue)
  },
  reduceRight (target, receiver, callback, initialValue) {
    return target.entities.value.reduceRight(callback, initialValue)
  },
  reverse () {
    throw new Error("'reverse' method is not available.")
  },
  shift () {
    throw new Error("'shift' method is not available.")
  },
  slice (target, receiver, start, end) {
    return target.entities.value.slice(start, end)
  },
  some (target, receiver, callback, thisArg) {
    return target.entities.value.some(callback, thisArg)
  },
  sort () {
    throw new Error("'sort' method is not available.")
  },
  splice () {
    throw new Error("'splice' method is not available.")
  },
  toLocaleString () {
    throw new Error("'toLocaleString' method is not implemented yet.")
  },
  toString () {
    throw new Error("'toString' method is not implemented yet.")
  },
  unshift () {
    throw new Error("'unshift' method is not implemented yet.")
  },
  values (target, receiver) {
    return target.entities.value.values()
  }
}
