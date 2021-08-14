<script>
import FuraTextField from 'fura-vue/component/text-field/index.js'
import { OdataValue } from 'odata-tools'
import Field from '../../mixin/field.js'

export default {
  name: 'LlescaFieldText',
  mixins: [Field],
  components: { 'fura-text-field': FuraTextField },
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
    /** Texto de ejemplo a mostrar en el campo. */
    placeholder: { type: String, default: null },
    /** Prefijo que se muestra antes del contenido del campo de texto. No está incluido en el valor. */
    prefix: { type: String, default: '' },
    /** Sufijo que se muestra después del contenido del campo de texto. No está incluido en el valor. */
    suffix: { type: String, default: '' },
    /** Si el campo de texto permite entrar varias líneas. */
    multiline: { type: Boolean, default: false },
    /** El nombre del icono a mostrar en el campo de texto. */
    icon: { type: String, default: '' },
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /** Longitud máxima (número de caracteres) del valor. */
    maxlength: { type: Number, default: null },
    /** Indica si el campo es no redimensionable para campos de texto de varias líneas. */
    unresizable: { type: Boolean, default: false },
    /** Indica si se ajustaautomáticamente la altura para campos de texto de varias líneas. */
    autoAdjustHeight: { type: Boolean, default: false },
    /** Valor actual del campo. */
    modelValue: { type: [String, OdataValue], default: null },
    /** Patrón que debe cumplir el valor del campo para ser válido. */
    pattern: { type: RegExp, default: null },
    /**
     * Método para validar el campo. El método puede ser asincrono.
     * @param {string} value El valor actual del campo.
     * @param {object} options Opciones con las que se llama al metodo "validate".
     * @returns {string} Si el valor del campo es válido,el metodo debe devolver null. Si el valor del campo no es válido, el metodo debe devolver un texto con la descripción del error.
     */
    validator: { type: Function, default: () => null },
    /** Tipo de dato OdataValue a usar. */
    odataType: {
      type: Object,
      default: null,
      validator: odataType => !odataType ||
        odataType.constructor === OdataValue ||
        odataType.constructor instanceof OdataValue
    }
  },
  emits: [
    /**
     * Se genera cuando el usuario realiza una alteración en el valor del campo.
     * @property {string, OdataValue} modelValue Valor actual del campo.
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
      return this.modelValue instanceof OdataValue
        ? this.modelValue.value
        : this.modelValue
    }
  },
  methods: {
    /**
     * Valida el campo.
     * @param {object} options Opciones de la validacion.
     * @param {boolean} options.ignoreAll Indica si deben ignorarse todas las validaciones internas.
     * @param {boolean} options.ignoreRequired Indica si deben ignorarse todas la validación de requerido.
     * @param {boolean} options.ignoreMaxlength Indica si deben ignorarse todas la validación de longitud máxima de carácteres.
     * @param {boolean} options.ignorePattern Indica si deben ignorarse todas la validación de patrón.
     * @param {boolean} options.requiredMessage Mensaje de error a mostrar cuando el campo para la validación "required".
     * @param {boolean} options.maxlengthMessage Mensaje de error a mostrar cuando el campo para la validación "maxlength
     * @param {boolean} options.patternMessage Mensaje de error a mostrar cuando el campo para la validación "pattern
     * @returns {boolean} true si el valor del campo es valido. false en caso contrario.
     * @public
     */
    async validate (options = {}) {
      this.errorMessage = ''

      if (this.rawValue) {
        if (!options.ignoreAll && !options.ignoreMaxlength && this.maxlength !== null && this.rawValue.length > this.maxlength) {
          this.errorMessage = options.maxlengthMessage ?? `La longitud màxima es de ${this.maxlength} caracters.`
          return false
        }

        if (!options.ignoreAll && !options.ignorePattern && this.pattern && !this.rawValue.match(this.pattern)) {
          this.errorMessage = options.patternMessage ?? 'El valor del text no compleix el patró especificat.'
          return false
        }
      } else {
        if (!options.ignoreAll && !options.ignoreRequired && this.required) {
          this.errorMessage = options.requiredMessage ?? 'Aquest camp es requerit.'
          return false
        }
      }

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
  <fura-text-field
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :placeholder="placeholder"
    :prefix="prefix"
    :suffix="suffix"
    :multiline="multiline"
    :icon="icon"
    :readonly="readonly"
    :maxlength="maxlength"
    :unresizable="unresizable"
    :auto-adjust-height="autoAdjustHeight"
    :model-value="rawValue"
    @update:model-value="handleUpdateModelValue"
    @click="$emit('click')"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
    @keydown="$emit('keydown', $event)"
  />
</template>
