<script setup>
import { ref, computed, toRef, watch, onBeforeUnmount, nextTick } from 'vue'
import debounce from '../../utils/debounce'

const $props = defineProps({
  /** Etiqueta que se muestra encima del campo de formulario asociado. */
  label: { type: String, default: undefined },
  /** La descripción se muestra debajo del campo del formulario asociado para proporcionar detalles adicionales sobre qué valor ingresar. */
  description: { type: String, default: undefined },
  /** Dibuja el borde del campo con color de error. */
  invalid: { type: Boolean, default: false },
  /** Indica si el campo de formulario asociado no tiene bordes. */
  borderless: { type: Boolean, default: undefined },
  /** Indica si el campo de formulario asociado está subrayado o no. */
  underlined: { type: Boolean, default: undefined },
  /** Método asincrónico para solicitar las opciones candidatas a elegir. */
  getOptions: { type: Function, required: true },
  /** Milisegundos sin cambiar el valor para realizar una solicitud de opciones candidatas. */
  getOptionsWait: { type: Number, default: undefined },
  /** Indica si las opciones seleccionadas deben ocultarse de las opciones candidatas. */
  filterOptions: { type: Boolean, default: undefined },
  /** Indica si el campo es de solo lectura. */
  readonly: { type: Boolean, default: undefined },
  /** Indica si el campo permite seleccionar más de una opción. */
  multiple: { type: Boolean, default: undefined },
  /** Indica si el ComboBox se autocompleta. A medida que el usuario ingresa texto, se le sugerirán posibles coincidencias de la lista de opciones. */
  autoComplete: { type: Boolean, default: undefined },
  /** Indica si el campo ignora los acentos al autocompletar el valor. */
  accentInsensitive: { type: Boolean, default: undefined },
  /** Texto de ejemplo a mostrar en el campo. */
  placeholder: { type: String, default: undefined },
  /** Indica si el desplazamiento del Select debe hacerse sin animación. */
  immediateScroll: { type: Boolean, default: undefined },
  /** La cantidad máxima de opciones que se pueden seleccionar. */
  maxSelectedOptions: { type: Number, default: undefined },
  /** Método para registrar un campo en el formulario. */
  createField: { type: Function, default: null },
  /** Nombre del campo de formulario. */
  name: { type: [String, Symbol], default: () => Symbol('fieldText') },
  /** Opcion o lista de opciones seleccionadas. */
  modelValue: { type: undefined, default: undefined },
  /** Estado requerido del campo de formulario asociado. */
  required: { type: Boolean, default: false },
  /** Estado deshabilitado del campo de formulario asociado. */
  disabled: { type: Boolean, default: false },
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
   * Se genera cuando el usuario realiza una alteración en el valor de ComboBox.
   * @property {Array} modelValue Lista de opciones seleccionadas
   */
  'update:modelValue',
  /** Se genera cuando el componente recibe el foco. */
  'focus',
  /** Se genera cuando el componente pierde el foco. */
  'blur'
])

const rules = computed(() => {
  return [
    $props.required && (
      value =>
        (
          ($props.multiple && !value?.length) ||
          (!$props.multiple && !value)
        ) &&
        'Aquest camp es requerit.'
    ),
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
  errorMessage.value = ''
  $emit('update:modelValue', $event)
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
    $emit('update:modelValue', $props.multiple ? [] : null)
  }
})

onBeforeUnmount(destroy)
</script>

<template>
  <fura-combo-box-async
    :label="label"
    :description="description"
    :borderless="borderless"
    :underlined="underlined"
    :get-options="getOptions"
    :get-options-wait="getOptionsWait"
    :filter-options="filterOptions"
    :readonly="readonly"
    :multiple="multiple"
    :auto-complete="autoComplete"
    :accent-insensitive="accentInsensitive"
    :placeholder="placeholder"
    :immediate-scroll="immediateScroll"
    :max-selected-options="maxSelectedOptions"
    :error-message="errorMessage"
    :model-value="modelValue"
    :required="required"
    :disabled="disabled"
    @update:model-value="handleUpdateModelValue"
    @focus="$emit('focus', $event)"
    @blur="handleBlur"
  />
</template>
