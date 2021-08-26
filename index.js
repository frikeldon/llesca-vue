import BaseListView from './component/base-list-view/index.js'
import ListView from './component/list-view/index.js'
import ListViewAggregated from './component/list-view-aggregated/index.js'

export const components = {
  BaseListView,
  ListView,
  ListViewAggregated
}

export default function install (app, { prefix = 'llesca' } = {}) {
  for (const name in components) {
    const kebabName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    app.component(`${prefix}-${kebabName}`, components[name])
  }
}
