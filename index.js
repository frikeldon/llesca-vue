import ListViewSimple from './component/list-view-simple/index.js'

export const components = {
  ListViewSimple
}

export default function install (app, { prefix = 'llesca' } = {}) {
  for (const name in components) {
    const kebabName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    app.component(`${prefix}-${kebabName}`, components[name])
  }
}
