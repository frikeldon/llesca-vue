import FieldCheckbox from './component/field-checkbox/index.js'
import FieldCombo from './component/field-combo/index.js'
import FieldDate from './component/field-date/index.js'
import FieldNumber from './component/field-number/index.js'
import FieldText from './component/field-text/index.js'

const components = {
  FieldCheckbox,
  FieldCombo,
  FieldDate,
  FieldNumber,
  FieldText
}

export { components }

export default function install (app, { prefix = 'llesca' } = {}) {
  for (const name in components) {
    const kebabName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    app.component(`${prefix}-${kebabName}`, components[name])
  }
}
