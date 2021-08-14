<script>
import FuraComboBox from 'fura-vue/component/combo-box/index.js'
import { OdataLookup } from 'odata-tools'
import Field from '../../mixin/field.js'

export default {
  name: 'LlescaFieldCombo',
  mixins: [Field],
  components: { 'fura-combo-box': FuraComboBox },
  props: {
    /** Nombre del campo en el formulario. */
    name: { type: String, required: true },
    /** Etiqueta que se muestra encima del campo de formulario asociado. */
    label: { type: String, default: '' },
    /** La descripción se muestra debajo del campo del formulario asociado para proporcionar detalles adicionales sobre qué valor ingresar. */
    description: { type: String, default: '' },
    /** Dibuja el borde del campo con color de error. */
    invalid: { type: Boolean, default: false },
    /** Estado deshabilitado del campo de formulario asociado. */
    disabled: { type: Boolean, default: false },
    /** Estado requerido del campo de formulario asociado. */
    required: { type: Boolean, default: false },
    /** Indica si el campo de formulario asociado no tiene bordes. */
    borderless: { type: Boolean, default: false },
    /** Indica si el campo de formulario asociado está subrayado o no. */
    underlined: { type: Boolean, default: false },
    /** Las opciones de ComboBox. */
    options: { type: Array, required: true },
    /** Valor o lista de valores seleccionados. */
    modelValue: { type: undefined, default: null },
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /** Indica si el campo permite seleccionar más de una opción. */
    multiple: { type: Boolean, default: false },
    /** Indica si el ComboBox es de entrada libre, lo que permite escribir las opciones a seleccionar. */
    allowFreeform: { type: Boolean, default: false },
    /** Indica si el ComboBox se autocompleta. A medida que el usuario ingresa texto, se le sugerirán posibles coincidencias de la lista de opciones. */
    autoComplete: { type: Boolean, default: false },
    /** Indica si el campo ignora los acentos al autocompletar el valor. */
    accentInsensitive: { type: Boolean, default: false },
    /** Texto de ejemplo a mostrar en el campo. */
    placeholder: { type: String, default: null },
    /** Indica si el desplazamiento del Select debe hacerse sin animación. */
    immediateScroll: { type: Boolean, default: false },
    /** Indica si las opciones deben ocultar la caja de selección cuando el estado es multiple. */
    hideCheckbox: { type: Boolean, default: false },
    /** La cantidad máxima de opciones que se pueden seleccionar. */
    maxSelectedOptions: { type: Number, default: -1 },
    /**
     * Método para validar el campo. El método puede ser asincrono.
     * @param {string} value El valor actual del campo.
     * @param {object} options Opciones con las que se llama al metodo "validate".
     * @returns {string} Si el valor del campo es válido,el metodo debe devolver null.
     *                   Si el valor del campo no es válido, el metodo debe devolver un texto con la descripción del error.
     */
    validator: { type: Function, default: () => null },
    /** Tipo de dato OdataLookup a usar. */
    odataType: {
      type: Object,
      default: null,
      validator: odataType => !odataType ||
        odataType.constructor === OdataLookup ||
        odataType.constructor instanceof OdataLookup
    }
  },
  emits: [
    /**
     * Se genera cuando el usuario realiza una alteración en el valor del campo.
     * @property {*} modelValue Valor actual del campo.
     */
    'update:modelValue',
    /** Se genera cuando el usuario hace clic en el icono del campo. */
    'click',
    /**
     * Se genera cuando el componente recibe el foco.
     * @property {FocusEvent} focusEvent Descripción del evento de cambio de foco.
     */
    'focus',
    /**
     * Se genera cuando el componente pierde el foco.
     * @property {FocusEvent} focusEvent Descripción del evento de cambio de foco.
     */
    'blur',
    /**
     * Se genera cuando el usuario pulsa una tecla.
     * @property {KeyboardEvent} keyboardEvent Descripción del evento de pulsación de tecla.
     */
    'keydown'
  ],
  data () {
    return {
      errorMessage: ''
    }
  },
  computed: {
    rawValue () {
      if (this.multiple) {
        return this.modelValue?.map(value => value instanceof OdataLookup ? value.value : value)
      } else {
        return this.modelValue instanceof OdataLookup
          ? this.modelValue.value
          : this.modelValue
      }
    }
  },
  methods: {
    /**
     * Valida el campo.
     * @param {object} options Opciones de la validacion.
     * @param {boolean} options.ignoreAll Indica si deben ignorarse todas las validaciones internas.
     * @param {boolean} options.ignoreRequired Indica si deben ignorarse todas la validación de requerido.
     * @param {boolean} options.requiredMessage Mensaje de error a mostrar cuando el campo para la validación "required".
     * @returns {boolean} true si el valor del campo es valido. false en caso contrario.
     * @public
     */
    async validate (options = {}) {
      this.errorMessage = ''

      if (!options.ignoreAll && !options.ignoreRequired && this.required && !this.rawValue) {
        this.errorMessage = options.requiredMessage ?? 'Aquest camp es requerit.'
        return false
      }

      const errorMessage = await this.validator(this.modelValue, options)
      if (errorMessage) {
        this.errorMessage = errorMessage
        return false
      }

      return true
    },
    handleUpdateModelValue (value) {
      if (this.odataType) {
        if (this.multiple) {
          const typedValues = value.map(current => {
            const option = this.options.find(option => option.value === current)
            return new this.odataType.constructor(current, option?.text, this.odataType.options ?? this.modelValue)
          })
          this.$emit('update:modelValue', typedValues)
        } else {
          const option = this.options.find(option => option.value === value)
          const typedValue = new this.odataType.constructor(value, option?.text, this.odataType.options ?? this.modelValue)
          this.$emit('update:modelValue', typedValue)
        }
      } else {
        this.$emit('update:modelValue', value)
      }
      this.errorMessage = ''
    }
  }
}
</script>

<template>
  <fura-combo-box
    :label="label"
    :description="description"
    :invalid="invalid"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :options="options"
    :readonly="readonly"
    :multiple="multiple"
    :allow-freeform="allowFreeform"
    :auto-complete="autoComplete"
    :accent-insensitive="accentInsensitive"
    :placeholder="placeholder"
    :immediate-scroll="immediateScroll"
    :hide-checkbox="hideCheckbox"
    :max-selected-options="maxSelectedOptions"
    :error-message="errorMessage"
    :model-value="rawValue"
    @update:model-value="handleUpdateModelValue"
    @click="$emit('click')"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
    @keydown="$emit('keydown', $event)"
  />
</template>
