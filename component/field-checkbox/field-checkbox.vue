<script>
import FuraCheckbox from 'fura-vue/component/checkbox/index.js'
import { OdataBool } from 'odata-tools'

export default {
  name: 'LlescaFieldText',
  components: { 'fura-checkbox': FuraCheckbox },
  props: {
    /** El valor de Checkbox. */
    modelValue: { type: [Boolean, OdataBool], default: null },
    /**
     * Estado visual indeterminado. La configuración del estado indeterminado tiene
     * prioridad visual sobre el valor de Checkbox, pero no afecta a este.
     */
    indeterminate: { type: Boolean, default: false },
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
    /** Tipo de dato OdataBool a usar. */
    odataType: {
      type: Object,
      default: null,
      validator: odataType => !odataType ||
        odataType.constructor === OdataBool ||
        odataType.constructor instanceof OdataBool
    }
  },
  emits: [
    /**
     * Se genera cuando el usuario realiza una alteración en el valor de Checkbox.
     * @property {boolean} modelValue Nuevo valor de modelValue
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
    rawValue () {
      return this.modelValue instanceof OdataBool
        ? this.modelValue.value
        : this.modelValue
    },
    rawIndeterminate () {
      return this.indeterminate ||
        (this.modelValue instanceof OdataBool && this.modelValue.value === null)
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
      const newValue = this.odataType
        ? new this.odataType.constructor(value, this.odataType.options ?? this.modelValue)
        : value
      this.$emit('update:modelValue', newValue)
      this.errorMessage = ''
    }
  }
}
</script>

<template>
  <fura-checkbox
    :indeterminate="rawIndeterminate"
    :label="label"
    :box-side="boxSide"
    :disabled="disabled"
    :readonly="readonly"
    :model-value="rawValue"
    @update:modelValue="handleUpdateModelValue"
    @update:indeterminate="$emit('update:indeterminate', $event)"
  />
</template>
