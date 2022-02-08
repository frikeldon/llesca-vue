<script>
import Field from '../../mixin/field.js'

export default {
  name: 'LlescaFieldDate',
  mixins: [Field],
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
    /** Indica si el campo es de solo lectura. */
    readonly: { type: Boolean, default: false },
    /** Texto de ejemplo a mostrar en el campo. */
    placeholder: { type: String, default: null },
    /** Indica si DatePicker permite o no la entrada de teclado. */
    notWritable: { type: Boolean, default: false },
    /** Textos para identificar los dias de la semana empezando por el domingo. */
    days: {
      type: Array,
      default: () => ['d', 'l', 'm', 'x', 'j', 'v', 's'],
      validator: days => days.length === 7 &&
        days.every(day => typeof day === 'string')
    },
    /** Textos para identificar los meses. */
    months: {
      type: Array,
      default: () => [
        'Gener',
        'Febrer',
        'Març',
        'Abril',
        'Maig',
        'Juny',
        'Juliol',
        'Agost',
        'Setembre',
        'Octubre',
        'Novembre',
        'Desembre'
      ],
      validator: months => months.length === 12 &&
        months.every(month => typeof month === 'string')
    },
    /** El texto del enlace "Ir a hoy" que se muestra en el calendario. */
    goToday: {
      type: String,
      default: ''
    },
    /** Primer dia de la semana a mostrar en el calendario (0:domingo - 6:sabado). */
    firstDayOfTheWeek: {
      type: Number,
      default: 1,
      validator: firstDayOfTheWeek => Number.isInteger(firstDayOfTheWeek) &&
        firstDayOfTheWeek >= 0 &&
        firstDayOfTheWeek <= 6
    },
    /** Día a resaltar como actual. Si no se especifica se coge la fecha actual del sistema. */
    today: {
      type: Date,
      default: () => new Date()
    },
    /** Fecha seleccionada en el calendario. */
    modelValue: {
      type: [Date, Object],
      default: null
    },
    /** Función para convertir de texto a fecha. */
    parse: {
      type: Function,
      default: text => {
        const [, day, month, year] =
        text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/) || []
        return day && month && year
          ? new Date(Number(year), Number(month) - 1, Number(day))
          : null
      }
    },
    /** Función para convertir de fecha a texto cuando el campo no tiene el foco. */
    formatify: {
      type: Function,
      default: null
    },
    /** Función para convertir de fecha a texto cuando el campo tiene el foco. */
    stringify: {
      type: Function,
      default: date => {
        const padZero = (num, length = 2) => num.toString().padStart(length, '0')
        const day = padZero(date.getDate())
        const month = padZero(date.getMonth() + 1)
        const year = padZero(date.getFullYear(), 4)
        return `${day}/${month}/${year}`
      }
    },
    /** Valor mínimo. */
    min: { type: Date, default: null },
    /** Valor máximo. */
    max: { type: Date, default: null },
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
     * Se genera cuando el usuario selecciona una fecha en la vista de dias.
     * @property {Date,Object} modelValue Fecha seleccionada en el calendario.
     */
    'update:modelValue',
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
          if (this.min && this.min.getTime() > this.rawValue.getTime()) {
            this.errorMessage = `El valor mínim es ${this.min}.`
            return false
          }

          if (this.max && this.max.getTime() < this.rawValue.getTime()) {
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
  <fura-date-picker
    :label="label"
    :description="description"
    :invalid="invalid"
    :error-message="errorMessage"
    :disabled="disabled"
    :required="required"
    :borderless="borderless"
    :underlined="underlined"
    :readonly="readonly"
    :placeholder="placeholder"
    :not-writable="notWritable"
    :days="days"
    :months="months"
    :go-today="goToday"
    :first-day-of-the-week="firstDayOfTheWeek"
    :today="today"
    :model-value="rawValue"
    :parse="parse"
    :stringify="formatify"
    :stringify-focus="stringify"
    @update:model-value="handleUpdateModelValue"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  />
</template>
