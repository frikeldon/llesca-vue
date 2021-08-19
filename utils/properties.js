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
