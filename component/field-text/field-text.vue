<script setup>
import { ref, computed, toRef, watch, onBeforeUnmount, nextTick } from 'vue'
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
  /** Prefijo que se muestra antes del contenido del campo de texto. No está incluido en el valor. */
  prefix: { type: String, default: undefined },
  /** Sufijo que se muestra después del contenido del campo de texto. No está incluido en el valor. */
  suffix: { type: String, default: undefined },
  /** Si el campo de texto permite entrar varias líneas. */
  multiline: { type: Boolean, default: undefined },
  /** El nombre del icono a mostrar en el campo de texto. */
  icon: { type: String, default: undefined },
  /** Indica si el campo es de solo lectura. */
  readonly: { type: Boolean, default: undefined },
  /** Indica si el campo es no redimensionable para campos de texto de varias líneas. */
  unresizable: { type: Boolean, default: undefined },
  /** Indica si se ajustaautomáticamente la altura para campos de texto de varias líneas. */
  autoAdjustHeight: { type: Boolean, default: undefined },
  /** Indica si el campo es del tipo 'password' */
  password: { type: Boolean, default: undefined },
  /** Método para registrar un campo en el formulario. */
  createField: { type: Function, default: null },
  /** Nombre del campo de formulario. */
  name: { type: [String, Symbol], default: () => Symbol('fieldText') },
  /** Valor actual del campo. */
  modelValue: { type: String, default: null },
  /** Estado requerido del campo de formulario asociado. */
  required: { type: Boolean, default: false },
  /** Estado deshabilitado del campo de formulario asociado. */
  disabled: { type: Boolean, default: false },
  /** Longitud máxima (número de caracteres) del valor. */
  maxlength: { type: Number, default: null },
  /** Patrón que debe cumplir el valor del campo para ser válido. */
  pattern: { type: RegExp, default: null },
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
  autoValidateWait: { type: Number, default: 0 },
  /** El componente elimina el valor del campo cuando el componente se deshabilita. */
  clearValueOnDisabled: { type: Boolean, default: false }
})

const $emit = defineEmits([
  /**
   * Se genera cuando el usuario realiza una alteración en el valor del campo.
   * @property {string} modelValue Valor actual del campo.
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
])

const rules = computed(() => {
  return [
    $props.required &&
      (value => !value && 'Aquest camp es requerit.'),

    $props.maxlength !== null &&
      (value => value?.length > $props.maxlength && `La longitud màxima es de ${$props.maxlength} caracters.`),

    $props.pattern !== null &&
      (value => !!value && !value?.match($props.pattern) && 'El valor del text no compleix el patró especificat.'),

    ...($props.rules || [])
  ]
    .filter(rule => rule)
})

const { errorMessage, validate, clear, destroy } = $props.createField
  ? $props.createField(
    $props.name,
    toRef($props, 'modelValue'),
    {
      rules,
      skip: toRef($props, 'disabled')
    }
  )
  : {
      errorMessage: ref(null),
      validate: () => true,
      clear: () => {},
      destroy: () => {}
    }

defineExpose({
  validate,
  clear
})

const validateDebounced = computed(() =>
  debounce(validate, $props.autoValidateWait)
)

function handleUpdateModelValue ($event) {
  $emit('update:modelValue', $event || null)
  if ($props.autoValidate === 'update') {
    nextTick(() => validateDebounced.value())
  }
}

function handleBlur ($event) {
  $emit('blur', $event)
  if ($props.autoValidate === 'blur') {
    validate()
  }
}

watch(() => $props.disabled, value => {
  if (value && $props.clearValueOnDisabled) {
    $emit('update:modelValue', null)
  }
})

onBeforeUnmount(destroy)
</script>

<template>
  <fura-text-field
    :label="label"
    :description="description"
    :invalid="invalid"
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
    :password="password"
    :error-message="errorMessage"
    :model-value="modelValue"
    :required="required"
    :disabled="disabled"
    @update:model-value="handleUpdateModelValue"
    @click="$emit('click', $event)"
    @focus="$emit('focus', $event)"
    @blur="handleBlur"
    @keydown="$emit('keydown', $event)"
  />
</template>
