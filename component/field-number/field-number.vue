<script>
import FuraNumberField from 'fura-vue/component/number-field/index.js'
import Field from '../../mixin/field.js'

export default {
  name: 'LlescaFieldNumber',
  mixins: [Field],
  components: { 'fura-number-field': FuraNumberField },
  props: {
    /** Nombre del campo en el formulario. */
    name: { type: String, default: null },
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
    /** Prefijo que se muestra antes del contenido del campo. No está incluido en el valor. */
    prefix: { type: String, default: '' },
    /** Sufijo que se muestra después del contenido del campo. No está incluido en el valor. */
    suffix: { type: String, default: '' },
    /** Si el campo permite entrar varias líneas. */
    multiline: { type: Boolean, default: false },
    /** El nombre del icono a mostrar en el campo. */
    icon: { type: String, default: '' },
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /** Longitud máxima (número de caracteres) del valor. */
    maxlength: { type: Number, default: -1 },
    /** Indica si el campo es no redimensionable para campos de varias líneas. */
    unresizable: { type: Boolean, default: false },
    /** Indica si se ajustaautomáticamente la altura para campos de varias líneas. */
    autoAdjustHeight: { type: Boolean, default: false },
    /** Valor actual del campo. */
    modelValue: { type: [Number, Object], default: null },
    /**
     * El estilo de formato numerico a usar.
     * @values decimal, currency, percent, unit
     */
    formatStyle: {
      type: String,
      default: 'decimal',
      validator: value => ['decimal', 'currency', 'percent', 'unit'].includes(value)
    },
    /** Indica si se debe mostrar separadores de grupos numéricos. */
    useGrouping: { type: Boolean, default: false },
    /** El número mínimo de dígitos enteros que se utilizarán. */
    minimumIntegerDigits: {
      type: Number,
      default: 1,
      validator: value => Number.isInteger(value) && value >= 1 && value <= 21
    },
    /** El número mínimo de dígitos fraccionarios que se utilizarán. */
    minimumFractionDigits: {
      type: Number,
      default: 0,
      validator: value => Number.isInteger(value) && value >= 0 && value <= 20
    },
    /** El número máximo de dígitos fraccionarios que se utilizarán. */
    maximumFractionDigits: {
      type: Number,
      default: 20,
      validator: value => Number.isInteger(value) && value >= 0 && value <= 20
    },
    /** El número mínimo de dígitos significativos que se utilizarán. */
    minimumSignificantDigits: {
      type: Number,
      default: 0,
      validator: value => Number.isInteger(value) && value >= 0 && value <= 21
    },
    /** El número máximo de dígitos significativos que se utilizarán. */
    maximumSignificantDigits: {
      type: Number,
      default: 0,
      validator: value => Number.isInteger(value) && value >= 0 && value <= 21
    },
    /** Función para convertir de texto a número. */
    parse: { type: Function, default: undefined },
    /** Función para convertir de número a texto cuando el campo tiene el foco. */
    stringify: { type: Function, default: undefined },
    /** Función para convertir de número a texto cuando el campo no tiene el foco. */
    formatify: { type: Function, default: undefined },
    /**
     * Alineación del texto cuando el campo no tiene el foco.
     * @values left, center, right
     */
    align: {
      type: String,
      default: 'left',
      validator: value => ['left', 'center', 'right'].includes(value)
    },
    /**
     * Alineación del texto cuando el campo tiene el foco.
     * @values left, center, right
     */
    alignFocus: {
      type: String,
      default: 'left',
      validator: value => ['left', 'center', 'right'].includes(value)
    },
    /** Valor mínimo. */
    min: { type: Number, default: null },
    /** Valor máximo. */
    max: { type: Number, default: null },
    /**
     * Método para validar el campo.
     * Si el valor del campo es válido, el metodo debe devolver null.
     * Si el valor del campo no es válido, el metodo debe devolver un texto con la descripción del error.
     */
    validator: { type: Function, default: () => null },
    /** Tipo de dato a usar por el campo. */
    dataType: { type: Function, default: null },
    /** Nombre de la propiedad del tipo de dato donde esta el dato nativo. */
    dataTypeProp: { type: [String, Symbol], default: 'value' }
  },
  emits: [
    /**
     * Se genera cuando el usuario realiza una alteración en el valor del campo.
     * @property {number,Object} modelValue Valor actual del campo.
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
    'blur'
  ],
  data () {
    return {
      errorMessage: ''
    }
  },
  methods: {
    async validate () {
      if (!this.disabled) {
        this.errorMessage = ''

        if (this.required && !this.rawValue) {
          this.errorMessage = 'Aquest camp es requerit.'
          return false
        }

        if (this.modelValue) {
          if (this.min !== null && this.min > this.rawValue) {
            this.errorMessage = `El valor mínim es ${this.min}.`
            return false
          }

          if (this.max !== null && this.max < this.rawValue) {
            this.errorMessage = `El valor màxim es ${this.max}.`
            return false
          }
        }

        const errorMessage = await this.validator(this.modelValue)
        if (errorMessage) {
          this.errorMessage = errorMessage
          return false
        }
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
  <fura-number-field
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
    :format-style="formatStyle"
    :use-grouping="useGrouping"
    :minimum-integer-digits="minimumIntegerDigits"
    :minimum-fraction-digits="minimumFractionDigits"
    :maximum-fraction-digits="maximumFractionDigits"
    :minimum-significant-digits="minimumSignificantDigits"
    :maximum-significant-digits="maximumSignificantDigits"
    :parse="parse"
    :stringify="formatify"
    :stringify-focus="stringify"
    :align="align"
    :align-focus="alignFocus"
    @update:model-value="handleUpdateModelValue"
    @click="$emit('click')"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  />
</template>
