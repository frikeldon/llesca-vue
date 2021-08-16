import FieldCheckbox from './component/field-checkbox/index.js'
import FieldCombo from './component/field-combo/index.js'
import FieldComboAsync from './component/field-combo-async/index.js'
import FieldDate from './component/field-date/index.js'
import FieldDictionary from './component/field-dictionary/index.js'
import FieldDictionaryAsync from './component/field-dictionary-async/index.js'
import FieldNumber from './component/field-number/index.js'
import FieldText from './component/field-text/index.js'
import Form from './component/form/index.js'
import StackDraggable from './component/stack-draggable/index.js'
import ViewListSimple from './component/view-list-simple/index.js'
import ViewListGrouped from './component/view-list-grouped/index.js'

import installOdataContent from './directive/odata-content.js'

import Llesca from './llesca.js'

const components = {
  FieldCheckbox,
  FieldCombo,
  FieldComboAsync,
  FieldDate,
  FieldDictionary,
  FieldDictionaryAsync,
  FieldNumber,
  FieldText,
  Form,
  StackDraggable,
  ViewListSimple,
  ViewListGrouped
}

export { components }

export default function install (app, {
  prefix = 'llesca',
  apiUrl = '/',
  schema = {},
  types: globalTypes = {}
} = {}) {
  for (const name in components) {
    const kebabName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    app.component(`${prefix}-${kebabName}`, components[name])
  }

  installOdataContent(app)

  app.config.globalProperties.$llesca = new Llesca(apiUrl, schema, globalTypes)
}
