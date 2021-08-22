import ListViewAggregated from './component/list-view-aggregated/index.js'
import ListViewGrouped from './component/list-view-grouped/index.js'
import ListViewSimple from './component/list-view-simple/index.js'

export const components = {
  ListViewAggregated,
  ListViewGrouped,
  ListViewSimple
}

export default function install (app, { prefix = 'llesca' } = {}) {
  for (const name in components) {
    const kebabName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    app.component(`${prefix}-${kebabName}`, components[name])
  }
}
