<script>
import Field from '../../mixin/field.js'

export default {
  name: 'LlescaFieldCheckbox',
  mixins: [Field],
  props: {
    /** Nombre del campo en el formulario. */
    name: { type: String, default: null },
    /** El valor de Checkbox. */
    modelValue: { type: [Boolean, Object], default: null },
    /** Indica si el campo acepta valores nulos en vez de tratarlos como falsos. */
    nullable: { type: Boolean, default: false },
    /** Label a mostrar junto a la casilla de verificación. */
    label: { type: String, default: '' },
    /**
     * Indica si la casilla de verificación se dibuja antes (start) o después (end) de Label.
     * @values start, end
     */
    boxSide: {
      type: String,
      default: 'start',
      validator: value => !value || ['start', 'end'].includes(value)
    },
    /** Estado de deshabilitado. */
    disabled: { type: Boolean, default: false },
    /** Indica si Checkbox es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /**
     * Método para validar el campo. El método puede ser asincrono.
     * @param {string} value El valor actual del campo.
     * @param {object} options Opciones con las que se llama al metodo "validate".
     * @returns {string} Si el valor del campo es válido,el metodo debe devolver null. Si el valor del campo no es válido, el metodo debe devolver un texto con la descripción del error.
     */
    validator: { type: Function, default: () => null },
    /** Tipo de dato a usar por el campo. */
    dataType: { type: Function, default: null },
    /** Nombre de la propiedad del tipo de dato donde esta el dato nativo. */
    dataTypeProp: { type: [String, Symbol], default: 'value' }
  },
  emits: [
    /**
     * Se genera cuando el usuario realiza una alteración en el valor de Checkbox.
     * @property {boolean,Object} modelValue Nuevo valor de modelValue
     */
    'update:modelValue',
    /**
     * Se genera cuando el usuario realiza una alteración en el valor de Checkbox cuando el estado visual es indeterminado.
     * @property {boolean} indeterminate Nuevo valor de indeterminate
     */
    'update:indeterminate'
  ],
  data () {
    return {
      errorMessage: ''
    }
  },
  computed: {
    rawIndeterminate () {
      const { nullable, rawValue } = this
      return nullable && rawValue == null
    }
  },
  methods: {
    /**
     * Valida el campo.
     * @param {object} options Opciones de la validacion.
     * @returns {boolean} true si el valor del campo es valido. false en caso contrario.
     * @public
     */
    async validate (options = {}) {
      this.errorMessage = ''

      const errorMessage = await this.validator(this.modelValue, options)
      if (errorMessage) {
        this.errorMessage = errorMessage
        return false
      }

      return true
    },
    handleUpdateModelValue (value) {
      this.updateValue(value)
      this.errorMessage = ''
    }
  }
}
</script>

<template>
  <fura-checkbox
    ref="field"
    :indeterminate="rawIndeterminate"
    :label="label"
    :box-side="boxSide"
    :disabled="disabled"
    :readonly="readonly"
    :model-value="rawValue"
    @update:model-value="handleUpdateModelValue"
  />
</template>
