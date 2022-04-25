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
  /** Texto de ejemplo a mostrar en el campo. */
  placeholder: { type: String, default: undefined },
  /** Prefijo que se muestra antes del contenido del campo. No está incluido en el valor. */
  prefix: { type: String, default: undefined },
  /** Sufijo que se muestra después del contenido del campo. No está incluido en el valor. */
  suffix: { type: String, default: undefined },
  /** Si el campo permite entrar varias líneas. */
  multiline: { type: Boolean, default: undefined },
  /** El nombre del icono a mostrar en el campo. */
  icon: { type: String, default: undefined },
  /** Indica si el campo es de solo lectura. */
  readonly: { type: Boolean, default: undefined },
  /** Longitud máxima (número de caracteres) del valor. */
  maxlength: { type: Number, default: undefined },
  /** Indica si el campo es no redimensionable para campos de varias líneas. */
  unresizable: { type: Boolean, default: undefined },
  /** Indica si se ajustaautomáticamente la altura para campos de varias líneas. */
  autoAdjustHeight: { type: Boolean, default: undefined },
  /** El estilo de formato numerico a usar. */
  formatStyle: { type: String, default: undefined },
  /** Indica si se debe mostrar separadores de grupos numéricos. */
  useGrouping: { type: Boolean, default: undefined },
  /** El número mínimo de dígitos enteros que se utilizarán. */
  minimumIntegerDigits: { type: Number, default: undefined },
  /** El número mínimo de dígitos fraccionarios que se utilizarán. */
  minimumFractionDigits: { type: Number, default: undefined },
  /** El número máximo de dígitos fraccionarios que se utilizarán. */
  maximumFractionDigits: { type: Number, default: undefined },
  /** El número mínimo de dígitos significativos que se utilizarán. */
  minimumSignificantDigits: { type: Number, default: undefined },
  /** El número máximo de dígitos significativos que se utilizarán. */
  maximumSignificantDigits: { type: Number, default: undefined },
  /** Función para convertir de texto a número. */
  parse: { type: Function, default: undefined },
  /** Función para convertir de número a texto cuando el campo no tiene el foco. */
  stringify: { type: Function, default: undefined },
  /** Función para convertir de número a texto cuando el campo tiene el foco. */
  stringifyFocus: { type: Function, default: undefined },
  /** Alineación del texto cuando el campo no tiene el foco. */
  align: { type: String, default: undefined },
  /** Alineación del texto cuando el campo tiene el foco. */
  alignFocus: { type: String, default: undefined },
  /** Método para registrar un campo en el formulario. */
  createField: { type: Function, default: null },
  /** Nombre del campo de formulario. */
  name: { type: [String, Symbol], default: Symbol('fieldText') },
  /** Valor actual del campo. */
  modelValue: { type: Number, default: null },
  /** Estado requerido del campo de formulario asociado. */
  required: { type: Boolean, default: false },
  /** Estado deshabilitado del campo de formulario asociado. */
  disabled: { type: Boolean, default: false },
  /** Valor mínimo. */
  min: { type: Number, default: null },
  /** Valor máximo. */
  max: { type: Number, default: null },
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
   * Se genera cuando el usuario realiza una alteración en el valor del campo.
   * @property {number} modelValue Valor actual del campo.
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
])

const rules = computed(() => {
  return [
    $props.required &&
      (value => typeof value !== 'number' && 'Aquest camp es requerit.'),

    $props.min !== null &&
      (value => typeof value === 'number' && value < $props.min && `El valor mínim es ${$props.min}.`),

    $props.max !== null &&
      (value => typeof value === 'number' && value > $props.max && `El valor màxim es ${$props.max}.`),

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
  <fura-number-field
    :label="label"
    :invalid="invalid"
    :borderless="borderless"
    :underlined="underlined"
    :placeholder="placeholder"
    :suffix="suffix"
    :multiline="multiline"
    :icon="icon"
    :readonly="readonly"
    :maxlength="maxlength"
    :unresizable="unresizable"
    :auto-adjust-height="autoAdjustHeight"
    :format-style="formatStyle"
    :use-grouping="useGrouping"
    :minimum-integer-digits="minimumIntegerDigits"
    :minimum-fraction-digits="minimumFractionDigits"
    :maximum-fraction-digits="maximumFractionDigits"
    :minimum-significant-digits="minimumSignificantDigits"
    :maximum-significant-digits="maximumSignificantDigits"
    :parse="parse"
    :stringify="stringify"
    :stringify-focus="stringifyFocus"
    :align="align"
    :align-focus="alignFocus"
    :error-message="errorMessage"
    :model-value="modelValue"
    :required="required"
    :disabled="disabled"
    @update:model-value="handleUpdateModelValue"
    @click="$emit('click', $event)"
    @focus="$emit('focus', $event)"
    @blur="handleBlur"
  />
</template>
