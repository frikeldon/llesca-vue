import { Odata, OdataEntity } from 'odata-tools'
import FieldCheckbox from './component/field-checkbox/index.js'
import FieldCombo from './component/field-combo/index.js'
import FieldDate from './component/field-date/index.js'
import FieldNumber from './component/field-number/index.js'
import FieldText from './component/field-text/index.js'
import StackDraggable from './component/stack-draggable/index.js'
import ViewListSimple from './component/view-list-simple/index.js'

import installOdataContent from './directive/odata-content.js'

const components = {
  FieldCheckbox,
  FieldCombo,
  FieldDate,
  FieldNumber,
  FieldText,
  StackDraggable,
  ViewListSimple
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

  const odata = new Odata(apiUrl)
  const entries = [['$odata', odata]]
  for (const name in schema) {
    const { endpoint, properties, types } = schema[name]
    entries.push([name, new OdataEntity({
      odata,
      endpoint,
      properties,
      types: { ...globalTypes, ...types }
    })])
  }

  installOdataContent(app)

  app.config.globalProperties.$llesca = Object.fromEntries(entries)
}
