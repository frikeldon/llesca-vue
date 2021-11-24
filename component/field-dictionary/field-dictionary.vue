<script>
import LlescaFieldCombo from '../field-combo/index.js'
import Field from '../../mixin/field.js'
import { requestGet } from '../../utils/odata.js'

export default {
  name: 'LlescaFieldDictionary',
  mixins: [Field],
  components: { 'llesca-field-combo': LlescaFieldCombo },
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
    /** Tipo de dato a usar por el campo. */
    dataType: { type: Function, default: null },
    /** Nombre de la propiedad del tipo de dato donde esta el dato nativo. */
    dataTypeProp: { type: [String, Symbol], default: 'value' },
    /** Nombre de la colección en el esquema. */
    endPoint: { type: String, required: true },
    /** Nombre de la propiedad que contiene el valor. */
    keyValue: { type: String, required: true },
    /** Nombre de la propiedad que contiene el texto. */
    keyText: { type: String, required: true },
    /** Filtro OData a aplicar */
    filter: { type: [String, Object], default: null },
    /** Sentido de ordenación de las opciones. */
    orderDirection: {
      type: String,
      default: null,
      validator: orderDirection => !orderDirection || ['asc', 'desc'].includes(orderDirection)
    },
    /** Indica si se ha de mostrar un valor en blanco. */
    hasEmptyValue: { type: Boolean, default: false },
    /** Cabeceras HTTP a enviar con las peticiones. */
    headers: { type: Object, default: () => {} }
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
      options: []
    }
  },
  computed: {
    rawValue () {
      return this.$refs.field?.rawValue
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
    validate (options) {
      return this.$refs.field.validate(options)
    },
    /**
     * Carga los datos del diccionario
     * @returns {Promise} Una promesa que se resuelve cuando todos los datos estan cargados.
     * @public
     */
    async loadData () {
      const response = await requestGet(this.endPoint, {
        $select: `${this.keyValue},${this.keyText}`,
        $filter: this.filter ?? undefined,
        $orderby: this.orderDirection
          ? this.orderDirection === 'desc'
            ? `${this.keyText} desc`
            : `${this.keyText} asc`
          : undefined
      }, this.headers)

      const options = response.value
        .map(row => ({
          value: row[this.keyValue],
          text: row[this.keyText]
        }))

      this.options = this.hasEmptyValue
        ? [{ value: undefined, text: '' }, ...options]
        : options

      if (!this.options.some(option => option.value === this.modelValue)) {
        this.$emit('update:modelValue', null)
      }
    },
    updateValue (value) {
      return this.$refs.updateValue(value)
    }
  }
}
</script>

<template>
  <llesca-field-combo
    ref="field"
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
    :validator="validator"
    :data-type="dataType"
    :data-type-prop="dataTypeProp"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    @click="$emit('click')"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
    @keydown="$emit('keydown', $event)"
  />
</template>
