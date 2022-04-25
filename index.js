import packageJson from './package.json'

import FieldCombo from './component/field-combo/index.js'
import FieldComboAsync from './component/field-combo-async/index.js'
import FieldDate from './component/field-date/index.js'
import FieldDropdown from './component/field-dropdown/index.js'
import FieldNumber from './component/field-number/index.js'
import FieldNumberSpin from './component/field-number-spin/index.js'
import FieldTag from './component/field-tag/index.js'
import FieldText from './component/field-text/index.js'
import StackDraggable from './component/stack-draggable/index.js'

export const component = {
  FieldCombo,
  FieldComboAsync,
  FieldDate,
  FieldDropdown,
  FieldNumber,
  FieldNumberSpin,
  FieldTag,
  FieldText,
  StackDraggable
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
