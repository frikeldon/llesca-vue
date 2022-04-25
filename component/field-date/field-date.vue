<script setup>
import { computed, toRef, nextTick } from 'vue'
import debounce from '../../utils/debounce'

const $props = defineProps({
  /** Etiqueta que se muestra encima del campo de formulario asociado. */
  label: { type: String, default: undefined },
  /** La descripción se muestra debajo del campo del formulario asociado para proporcionar detalles adicionales sobre qué valor ingresar. */
  description: { type: String, default: undefined },
  /** Dibuja el borde del campo con color de error. */
  invalid: { type: Boolean, default: undefined },
  /** Indica si el campo de formulario asociado no tiene bordes. */
  borderless: { type: Boolean, default: undefined },
  /** Indica si el campo de formulario asociado está subrayado o no. */
  underlined: { type: Boolean, default: undefined },
  /** Indica si el campo es de solo lectura. */
  readonly: { type: Boolean, default: undefined },
  /** Texto de ejemplo a mostrar en el campo. */
  placeholder: { type: String, default: undefined },
  /** Indica si DatePicker permite o no la entrada de teclado. */
  notWritable: { type: Boolean, default: undefined },
  /** Textos para identificar los dias de la semana empezando por el domingo. */
  days: { type: Array, default: undefined },
  /** Textos para identificar los meses. */
  months: { type: Array, default: undefined },
  /** El texto del enlace "Ir a hoy" que se muestra en el calendario. */
  goToday: { type: String, default: undefined },
  /** Primer dia de la semana a mostrar en el calendario (0:domingo - 6:sabado). */
  firstDayOfTheWeek: { type: Number, default: undefined },
  /** Día a resaltar como actual. Si no se especifica se coge la fecha actual del sistema. */
  today: { type: Date, default: undefined },
  /** Función para convertir de texto a fecha. */
  parse: { type: Function, default: undefined },
  /** Función para convertir de fecha a texto cuando el campo tiene el foco. */
  stringifyFocus: { type: Function, default: undefined },
  /** Método para registrar un campo en el formulario. */
  createField: { type: Function, default: null },
  /** Nombre del campo de formulario. */
  name: { type: [String, Symbol], default: Symbol('fieldText') },
  /** Función para convertir de fecha a texto cuando el campo no tiene el foco. */
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
  /** Fecha seleccionada en el calendario. */
  modelValue: { type: Date, default: null },
  /** Estado requerido del campo de formulario asociado. */
  required: { type: Boolean, default: false },
  /** Estado deshabilitado del campo de formulario asociado. */
  disabled: { type: Boolean, default: false },
  /** Valor mínimo. */
  min: { type: Date, default: null },
  /** Valor máximo. */
  max: { type: Date, default: null },
  /** Reglas de validación. */
  rules: { type: Array, default: null },
  /**
   * Indica cuando debe validarse el campo automàticamente.
   * @values update, blur
   */
  autoValidate: {
    type: String,
    default: null,
    validator: value => !value || ['update', 'blur'].includes(value)
  },
  /** Milisegundos sin cambiar el valor para realizar una validación. */
  autoValidateWait: { type: Number, default: 0 }
})

const $emit = defineEmits([
  /**
   * Se genera cuando el usuario selecciona una fecha en la vista de dias.
   * @property {Date} modelValue Fecha seleccionada en el calendario.
   */
  'update:modelValue',
  /** Se genera cuando el componente recibe el foco. */
  'focus',
  /** Se genera cuando el componente pierde el foco. */
  'blur'
])

const rules = computed(() => {
  return [
    $props.required &&
      (value => !value && 'Aquest camp es requerit.'),

    $props.min !== null &&
      (value => value instanceof Date && value.getTime() < $props.min.getTime() && `El valor mínim es ${$props.stringify($props.min)}.`),

    $props.max !== null &&
      (value => value instanceof Date && value.getTime() > $props.max.getTime() && `El valor màxim es ${$props.stringify($props.max)}.`),

    ...($props.rules || [])
  ]
    .filter(rule => rule)
})

const { errorMessage, validate, clear } = $props.createField
  ? $props.createField(
    $props.name,
    toRef($props, 'modelValue'),
    {
      rules,
      skip: toRef($props, 'disabled')
    }
  )
  : {
      errorMessage: null,
      validate: () => true,
      clear: () => {}
    }

defineExpose({
  validate,
  clear
})

const validateDebounced = computed(() =>
  debounce(validate, $props.autoValidateWait)
)

function handleUpdateModelValue ($event) {
  $emit('update:modelValue', $event)
  if ($props.autoValidate === 'update') {
    nextTick(() => validateDebounced.value())
  }
}

function handleBlur ($event) {
  $emit('blur', $event)
  if ($props.autoValidate === 'blur') {
    validateDebounced.value()
  }
}
</script>

<template>
  <fura-date-picker
    :label="label"
    :description="description"
    :invalid="invalid"
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
    :parse="parse"
    :stringify="stringify"
    :stringify-focus="stringifyFocus"
    :error-message="errorMessage"
    :model-value="modelValue"
    :required="required"
    :disabled="disabled"
    @update:model-value="handleUpdateModelValue"
    @focus="$emit('focus', $event)"
    @blur="handleBlur"
  />
</template>
