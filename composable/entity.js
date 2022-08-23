import { reactive, markRaw, readonly, toRaw } from 'vue'
import { requestGet, requestPost, requestBatch } from '../utils/odata.js'

const internalState = Symbol('state')

/**
 * Permite descargar, gestionar y guardar los datos de una entidad odata y sus entidades descendientes.
 * @param {object} definition Definicion de la entidad.
 * @param {string} definition.navigationKey Nombre de la propiedad de navegacion.
 * @param {string} definition.entityName Nombre de la entidad.
 * @param {string} definition.primaryKey Nombre de la propiedad principal.
 * @param {string} definition.foreingKey Nombre de la propiedad que relacion con la entidad padre.
 * @param {array} definition.children Definiciones de las entidades hijas.
 * @param {array} definition.details Definiciones de las entidades y propiedades de detalle.
 * @param {array} definition.dateKeys Nombre de las propiedades de tipo fecha.
 * @param {string} apiUrl URL de la api OData.
 * @param {object} headers Cabeceras HTTP a enviar con las peticiones OData.
 * @returns Interfaz para gestionar los datos de la entidad.
 */
export function useEntity (definition, apiUrl, headers) {
  const entity = reactive(createEntityStructure({ definition }))
  entity.$root = entity
  return createInterface(entity, apiUrl, headers)
}

function createEntityStructure ({
  definition,
  id = null,
  data = {},
  child = undefined,
  detail = undefined,
  state = 'create',
  $parent = null,
  $root = null,
  $base = null
}) {
  return {
    definition: markRaw(definition),
    id,
    data,
    child: child ?? Array.isArray(definition.children)
      ? Object.fromEntries(
        definition.children.map(childSchema => [
          childSchema.navigationKey || childSchema.entityName,
          { nextId: 1, entities: [], deletedEntities: [] }
        ])
      )
      : null,
    detail: detail ?? Array.isArray(definition.details)
      ? Object.fromEntries(
        definition.details.map(detail => [
          detail.navigationKey || detail.entityName,
          null
        ])
      )
      : null,
    state,
    $parent,
    $root,
    $base,
    get primaryValue () {
      return this.data[this.definition.primaryKey]
    }
  }
}

function cloneEntityStructure (source, { $parent = null, $root = null, $base = source } = {}) {
  const clone = createEntityStructure({
    definition: source.definition,
    id: source.id,
    data: JSON.parse(JSON.stringify(source.data)),
    child: null,
    detail: source.detail
      ? JSON.parse(JSON.stringify(source.detail))
      : null,
    state: source.state,
    $parent,
    $root,
    $base
  })
  clone.$root = $root ?? clone

  clone.child = source.child
    ? Object.fromEntries(
      Object.entries(source.child).map(([name, sourceChild]) => [
        name,
        {
          nextId: sourceChild.nextId,
          entities: sourceChild.entities.map(childEntity =>
            cloneEntityStructure(
              childEntity,
              { $parent: clone, $root: clone.$root }
            )
          ),
          deletedEntities: sourceChild.deletedEntities.map(childEntity =>
            cloneEntityStructure(
              childEntity,
              { $parent: clone, $root: clone.$root }
            )
          )
        }
      ])
    )
    : null

  return clone
}

function createInterface (entity, apiUrl, headers) {
  return {
    state: readonly(entity),
    [internalState]: entity,

    /* Navegacion */

    getParent () {
      return entity.$parent
        ? createInterface(entity.$parent, apiUrl, headers)
        : null
    },

    getRoot () {
      return createInterface(entity.$root, apiUrl, headers)
    },

    getBase () {
      return entity.$base
        ? createInterface(entity.$base, apiUrl, headers)
        : null
    },

    getChild (name, id) {
      const childEntity = entity.child[name].entities.find(entity => entity.id === id)
      return childEntity
        ? createInterface(childEntity, apiUrl, headers)
        : null
    },

    /* Sincronizacion de datos en local */

    importData (data, { state } = {}) {
      setLoadedData(entity, data)
      entity.id = data[entity.definition.primaryKey]
      if (state) entity.state = state
    },

    /* Sincronizacion de datos con el servidor */

    async load (id) {
      const response = await requestGet(
        [apiUrl, `${entity.definition.entityName}(${id})`],
        { $expand: getExpandQuery(toRaw(entity.definition)) },
        headers
      )
      assignDownloadedDataToEntity(entity, response)
      entity.id = entity.primaryValue
    },

    async save () {
      if (entity.state === 'create') {
        const response = await requestPost(
          [apiUrl, entity.definition.entityName],
          getRequestData(entity, { removePrimaryKey: true }),
          null,
          headers
        )
        assignDownloadedDataToEntity(entity, response)
        entity.id = entity.primaryValue
        return response
      } else {
        const requests = getSaveRequests(entity)
        if (requests?.length > 0) {
          const response = await requestBatch(apiUrl, requests, headers)
          assignDownloadedBatchDataToEntity(entity, response)
          return response
        }
      }
    },

    /* Actualitzacion de datos */

    setProperty (name, value) {
      entity.data[name] = toRaw(value)
      markAsUpdated(entity)
    },

    setEntity (name, data) {
      entity.data = toRaw(data)
      markAsUpdated(entity)
    },

    setDetail (name, value) {
      entity.detail = entity.detail || {}
      entity.detail[name] = toRaw(value)
    },

    /* Gestion de datos de los hijos */

    createChildData (name, data) {
      entity.child[name].entities.push(createEntityStructure({
        definition: markRaw(entity.definition.children.find(childDefinition => childDefinition.entityName === name)),
        id: entity.child[name].nextId++,
        data: assignForeignKey(entity, name, data),
        state: 'create',
        $parent: entity,
        $root: entity.$root
      }))
    },

    updateChildData (name, id, data) {
      const childEntity = entity.child[name].entities.find(entity => entity.id === id)
      childEntity.data = assignForeignKey(entity, name, data)
      markAsUpdated(childEntity)
    },

    deleteChildData (name, id) {
      const index = entity.child[name].entities.findIndex(entity => entity.id === id)
      const [child] = entity.child[name].entities.splice(index, 1)
      if (child.state !== 'create') {
        entity.child[name].deletedEntities.push(child)
      }
    },

    /* Gestion de los hijos */

    createNewChild (name) {
      const childEntity = reactive(createEntityStructure({
        definition: markRaw(entity.definition.children.find(childDefinition =>
          childDefinition.navigationKey === name ||
          childDefinition.entityName === name
        )),
        id: null,
        data: assignForeignKey(entity, name, {}),
        state: 'create',
        $parent: entity,
        $root: entity.$root
      }))
      childEntity.$root = childEntity
      return createInterface(childEntity, apiUrl, headers)
    },

    addNewChild (name, newChild) {
      const newEntity = toRaw(newChild[internalState])
      newEntity.id = entity.child[name].nextId++
      entity.child[name].entities.push(newEntity)
    },

    createChildClone (name, id) {
      const childEntity = entity.child[name].entities.find(entity => entity.id === id)
      if (childEntity) {
        const cloneEntity = reactive(cloneEntityStructure(childEntity))
        return createInterface(cloneEntity, apiUrl, headers)
      }
      return null
    },

    applyChildClone (name, id, clone) {
      const index = entity.child[name].entities.findIndex(entity => entity.id === id)
      if (index > -1) {
        const replanted = replant(toRaw(clone[internalState]), entity)
        entity.child[name].entities[index] = replanted
      }
    }
  }
}

function getExpandQuery (definition) {
  const expands = []
  for (const child of definition.children || []) {
    const navigation = child.navigationKey || child.entityName
    if (child.children?.length > 0 || child.details?.length > 0) {
      expands.push(`${navigation}($expand=${getExpandQuery(child)})`)
    } else {
      expands.push(navigation)
    }
  }

  for (const child of definition.details || []) {
    const navigation = child.navigationKey || child.entityName
    expands.push(`${navigation}($select=${child.keys.join()})`)
  }

  if (expands.length > 0) {
    return expands.join()
  } else {
    return undefined
  }
}

function setLoadedData (entity, data) {
  for (const child of entity.definition.children || []) {
    const navigation = child.navigationKey || child.entityName
    const childData = data[navigation]
    delete data[navigation]
    entity.child[navigation].entities = []
    for (const current of childData || []) {
      const newChild = createEntityStructure({
        definition: markRaw(
          entity.definition.children.find(childDefinition =>
            childDefinition.navigationKey === navigation ||
            childDefinition.entityName === navigation
          )
        ),
        id: entity.child[navigation].nextId++,
        $parent: entity,
        $root: entity.$root
      })
      entity.child[navigation].entities.push(newChild)
      setLoadedData(newChild, current)
    }
  }
  for (const child of entity.definition.details || []) {
    const navigation = child.navigationKey || child.entityName
    entity.detail[navigation] = data[navigation]
    delete data[navigation]
  }
  entity.data = data
  entity.state = 'read'
}

function getRequestData (entity, { removePrimaryKey }) {
  const data = { ...entity.data }
  for (const name in entity.child) {
    data[name] = []
    for (const childEntity of entity.child[name].entities) {
      data[name].push(getRequestData(childEntity))
    }
  }
  if (removePrimaryKey) {
    data[entity.definition.primaryKey] = undefined
  }
  return data
}

function getSaveRequests (entity, prefix = null) {
  const requestId = prefix
    ? `${prefix}/${entity.definition.entityName}(${entity.id})`
    : `${entity.definition.entityName}(${entity.id})`
  if (entity.state === 'create') {
    return [{
      atomicityGroup: 'saveEntity',
      id: `saveEntity/${requestId}-create`,
      method: 'POST',
      url: entity.definition.entityName,
      body: getRequestData(entity, { removePrimaryKey: true })
    }]
  } else {
    const requests = []
    const key = entity.primaryValue
    if (entity.state === 'update') {
      requests.push({
        atomicityGroup: 'saveEntity',
        id: `saveEntity/${requestId}-update`,
        method: 'PUT',
        url: `${entity.definition.entityName}(${key})`,
        body: { ...entity.data }
      })
    }
    for (const name in entity.child) {
      for (const entityChild of entity.child[name].deletedEntities) {
        const childKey = entityChild.primaryValue
        requests.push({
          atomicityGroup: 'saveEntity',
          id: `saveEntity/${requestId}/d-${name}/${entityChild.definition.entityName}(${entityChild.id})-delete`,
          method: 'DELETE',
          url: `${entityChild.definition.entityName}(${childKey})`
        })
      }
      for (let index = 0; index < entity.child[name].entities.length; index += 1) {
        const entityChild = entity.child[name].entities[index]
        const childRequests = getSaveRequests(entityChild, `${requestId}/e-${name}`)
        if (childRequests?.length > 0) {
          requests.push(...childRequests)
        }
      }
    }
    return requests
  }
}

function markAsUpdated (entity) {
  if (entity.state !== 'create') {
    entity.state = 'update'
  }
}

function assignForeignKey (parentEntity, childName, data) {
  const childDefinition = parentEntity.definition.children.find(childDefinition =>
    childDefinition.navigationKey === childName ||
    childDefinition.entityName === childName
  )
  const newData = { ...toRaw(data) }
  if (
    childDefinition.foreingKey &&
    parentEntity.definition.primaryKey
  ) {
    newData[childDefinition.foreingKey] = parentEntity.primaryValue
  }
  return newData
}

function replant (entity, parent) {
  entity.$parent = parent
  entity.$root = parent.$root
  entity.$main = null

  if (entity.child) {
    for (const childName in entity.child) {
      const child = entity.child[childName]
      for (const item of child.entities) {
        replant(item, entity)
      }
      for (const item of child.deletedEntities) {
        replant(item, entity)
      }
    }
  }

  return entity
}

function convertDates (definition, data) {
  if (Array.isArray(definition.dateKeys)) {
    for (const name of definition.dateKeys) {
      if (data[name]) {
        data[name] = new Date(data[name])
      }
    }
  }
  if (Array.isArray(definition.children)) {
    for (const definitionChild of definition.children) {
      const navigation = definitionChild.navigation || definitionChild.entityName
      if (Array.isArray(data[navigation])) {
        for (const dataChild of data[navigation]) {
          convertDates(definitionChild, dataChild)
        }
      }
    }
  }
  return data
}

function assignDownloadedDataToEntity (entity, response) {
  const copy = JSON.parse(JSON.stringify(response))
  delete copy['@odata.context']
  convertDates(toRaw(entity.definition), copy)
  setLoadedData(entity, copy)
}

function traverseBatchRequestPath (entity, path) {
  let currentPath = path
  let container = null
  while (currentPath) {
    const entityName = `${entity.definition.entityName}(${entity.id})`
    if (currentPath === entityName) {
      return { entity, container }
    } else if (currentPath.startsWith(`${entityName}/`)) {
      currentPath = currentPath.substring(entityName.length + 1)
    } else if (/^(e|d)-\w+\//.test(currentPath)) {
      const [found, type, name] = currentPath.match(/^(e|d)-(\w+)\//)
      const containerName = type === 'd' ? 'deletedEntities' : 'entities'
      container = entity.child[name][containerName]
      currentPath = currentPath.substring(found.length)
      const [, entityId] = currentPath.match(/^\w+\((\d+)\)/)
      entity = container.find(child => String(child.id) === entityId)
    } else {
      throw new Error(`Invalid Batch Request Path '${path}'`)
    }
  }
  throw new Error(`Invalid Batch Request Path '${path}'`)
}

function assignDownloadedBatchDataToEntity (entity, responses = []) {
  for (const response of responses) {
    const [, path, action] = response.id.match(/^saveEntity\/(.*)-(create|update|delete)$/)
    if (action === 'delete') {
      const { target = entity, container } = traverseBatchRequestPath(entity, path)
      const index = container.indexOf(target)
      container.splice(index, 0)
    } else {
      const { target = entity } = traverseBatchRequestPath(entity, path)
      if (response.body) {
        setLoadedData(target, response.body)
      }
      target.state = 'read'
    }
  }
}
