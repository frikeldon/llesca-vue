import packageJson from './package.json'

export const component = {
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

export { useForm } from './composable/form.js'
