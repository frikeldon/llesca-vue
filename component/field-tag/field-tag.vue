<script setup>
import { computed, toRef, onBeforeUnmount, nextTick } from 'vue'
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
  /** Método asincrónico para solicitar los elementos candidatos a elegir. */
  getItems: { type: Function, required: true },
  /** Milisegundos sin cambiar el valor para realizar una solicitud de opciones candidatas. */
  getItemsWait: { type: Number, default: undefined },
  /** Indica si los elementos seleccionados deben ocultarse de los elementos candidatos. */
  filterItems: { type: Boolean, default: undefined },
  /** Indica si el TagPicker se autocompleta. A medida que el usuario ingresa texto, se le sugerirán posibles coincidencias de la lista de opciones. */
  autoComplete: { type: Boolean, default: undefined },
  /** Indica si el campo ignora los acentos al autocompletar el valor. */
  accentInsensitive: { type: Boolean, default: undefined },
  /** La cantidad máxima de elementos que se pueden seleccionar. */
  maxSelectedItems: { type: Number, default: undefined },
  /** Texto de ejemplo a mostrar en el campo. */
  placeholder: { type: String, default: undefined },
  /** El texto a mostrar en el progreso de carga. */
  loadingText: { type: String, default: undefined },
  /** Indica si el desplazamiento del Select debe hacerse sin animación. */
  immediateScroll: { type: Boolean, default: undefined },
  /** Método para registrar un campo en el formulario. */
  createField: { type: Function, default: null },
  /** Nombre del campo de formulario. */
  name: { type: [String, Symbol], default: () => Symbol('fieldText') },
  /** Lista de valores seleccionados. */
  modelValue: { type: Array, default: () => [] },
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
  autoValidateWait: { type: Number, default: 0 }
})

const $emit = defineEmits([
  /**
   * Se genera cuando el usuario realiza una alteración en el valor de TagPicker.
   * @property {Array} modelValue Lista de valores seleccionados.
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
      value => !value?.length && 'Aquest camp es requerit.'
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
      errorMessage: null,
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

onBeforeUnmount(destroy)
</script>

<template>
  <fura-tag-picker
    :label="label"
    :description="description"
    :invalid="invalid"
    :borderless="borderless"
    :underlined="underlined"
    :readonly="readonly"
    :get-items="getItems"
    :get-items-wait="getItemsWait"
    :filter-items="filterItems"
    :auto-complete="autoComplete"
    :accent-insensitive="accentInsensitive"
    :max-selected-items="maxSelectedItems"
    :placeholder="placeholder"
    :loading-text="loadingText"
    :immediate-scroll="immediateScroll"
    :error-message="errorMessage"
    :model-value="modelValue"
    :required="required"
    :disabled="disabled"
    @update:model-value="handleUpdateModelValue"
    @focus="$emit('focus', $event)"
    @blur="handleBlur"
  />
</template>
