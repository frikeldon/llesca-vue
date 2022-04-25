import packageJson from './package.json'

import FieldText from './component/field-text/index.js'

export const component = {
  FieldText
}

export function install (app, { prefix = 'llesca' } = {}) {
  for (const name in component) {
    const kebabName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    app.component('llesca-' + kebabName, component[name])
  }
}

export default {
  install,
  Llesca: component,
  version: packageJson.version
}

export { useValidations } from './composable/validations.js'
