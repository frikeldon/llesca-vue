export function isPathMultiple (path) {
  return path.split('/').some(step => step[0] === '*')
}

export function getValueFromPath (path, entity) {
  if (typeof path === 'string') {
    if (isPathMultiple(path)) {
      const steps = path.split('/')
      const stepMultiple = steps.findIndex(step => step[0] === '*')
      const stepsToArray = steps.splice(0, stepMultiple + 1)
      stepsToArray[stepMultiple] = stepsToArray[stepMultiple].substr(1)

      let level = entity
      while (level && stepsToArray.length > 0) {
        level = level[stepsToArray.shift()]
      }

      if (steps.length === 0) {
        return level
      } else {
        return level.map(root => {
          const localSteps = [...steps]
          let current = root
          while (current && localSteps.length > 0) {
            current = current[localSteps.shift()]
          }
          return current
        })
      }
    } else {
      const steps = path.split('/')
      let level = entity
      while (level && steps.length > 0) {
        level = level[steps.shift()]
      }
      return level
    }
  }
  return undefined
}

export function parsePropertiesFromPath (property, entity) {
  if (isPathMultiple(property.path)) {
    const steps = property.path.split('/')
    const stepMultiple = steps.findIndex(step => step[0] === '*')
    const stepsToArray = steps.splice(0, stepMultiple + 1)
    stepsToArray[stepMultiple] = stepsToArray[stepMultiple].substr(1)

    if (steps.length === 0) {
      let level = entity
      while (level && stepsToArray.length > 1) {
        level = level[stepsToArray.shift()]
      }
      const last = steps[0]
      level[last] = level[last].map(item => property.parse(item, property))
    } else {
      let level = entity
      while (level && stepsToArray.length > 0) {
        level = level[stepsToArray.shift()]
      }
      level.forEach(root => {
        const localSteps = [...steps]
        let current = root
        while (current && localSteps.length > 1) {
          current = current[localSteps.shift()]
        }
        const last = localSteps[0]
        current[last] = property.parse(current[last], property)
      })
    }
  } else {
    const steps = property.path.split('/')
    let level = entity
    while (level && steps.length > 1) {
      level = level[steps.shift()]
    }
    const last = steps[0]
    level[last] = property.parse(level[last], property)
  }
}

export function parseDataProperties (properties, data) {
  for (const property of properties) {
    if (property.parse) {
      if (property.$select) {
        for (const entity of data) {
          const value = entity[property.$select]
          entity[property.$select] = property.parse(value, property)
        }
      }
      if (property.$expand) {
        for (const entity of data) {
          parsePropertiesFromPath(property, entity)
        }
      }
    }
  }
  return data
}

export function createRows (columns, data, { aggregate } = {}) {
  const rows = []
  for (const entity of data) {
    const row = []
    for (const column of columns) {
      if (aggregate && column.property.aggregate) {
        row.push(entity[aggregatedName(column.propertyIndex)])
      } else if (column.property.$expand) {
        row.push(getValueFromPath(column.property.path, entity))
      } else if (column.property.$select) {
        row.push(entity[column.property.$select])
      }
    }

    rows.push(row)
  }
  return rows
}

export function aggregatedName (index) {
  return `aggregatedProperty${index}`
}

export function getOrderIcon (order, defaultValue = null) {
  if (order?.direction === 'asc') {
    return 'SortDown'
  }
  if (order?.direction === 'desc') {
    return 'SortUp'
  }
  return defaultValue
}
