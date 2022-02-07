import BaseListView from './component/base-list-view/index.js'
import ConfigListViewSimple from './component/config-list-view-simple/index.js'
import FieldCheckbox from './component/field-checkbox/index.js'
import FieldCombo from './component/field-combo/index.js'
import FieldComboAsync from './component/field-combo-async/index.js'
import FieldDate from './component/field-date/index.js'
import FieldDictionary from './component/field-dictionary/index.js'
import FieldDictionaryAsync from './component/field-dictionary-async/index.js'
import FieldNumber from './component/field-number/index.js'
import FieldText from './component/field-text/index.js'
import Form from './component/form/index.js'
import ListView from './component/list-view/index.js'
import ListViewAggregated from './component/list-view-aggregated/index.js'
import StackDraggable from './component/stack-draggable/index.js'

export const components = {
  BaseListView,
  ConfigListViewSimple,
  FieldCheckbox,
  FieldCombo,
  FieldComboAsync,
  FieldDate,
  FieldDictionary,
  FieldDictionaryAsync,
  FieldNumber,
  FieldText,
  Form,
  ListView,
  ListViewAggregated,
  StackDraggable
}

export default function install (app, { prefix = 'llesca' } = {}) {
  for (const name in components) {
    const kebabName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    app.component('llesca-' + kebabName, components[name])
  }
}
