import CollectionField from '../component/form/index.js'

function ancestorOfType (type, vnode) {
  let current = vnode
  while (current) {
    if (current.$.type === type) {
      return current
    }
    current = current.$parent
  }
  return null
}

function registerField (name, field) {
  if (name !== null) {
    const form = ancestorOfType(CollectionField, field.$parent)
    if (form) {
      form.registerField(name, field)
      return form
    }
  }
  return null
}

function unregisterField (name, field) {
  if (field.form) {
    field.form.unregisterField(name)
  }
}

export default {
  props: {
    /** Nombre del campo en el formulario. */
    name: { type: String, default: null },
    /** Valor del campo. */
    modelValue: { type: null, default: undefined },
    /** Tipo de dato a usar por el campo. */
    dataType: { type: Function, default: null },
    /** Nombre de la propiedad del tipo de dato donde esta el dato nativo. */
    dataTypeProp: { type: [String, Symbol], default: 'value' }
  },
  emits: [
    /** Se genera cuando el usuario realiza una alteración en el valor del campo. */
    'update:modelValue'
  ],
  data () {
    return { form: null }
  },
  computed: {
    rawValue () {
      const { modelValue, dataType, dataTypeProp } = this
      return dataType && modelValue instanceof dataType
        ? modelValue[dataTypeProp]
        : modelValue
    }
  },
  methods: {
    updateValue (value) {
      if (this.dataType) {
        const DataType = this.dataType
        this.$emit('update:modelValue', new DataType(value))
      } else {
        this.$emit('update:modelValue', value)
      }
    }
  },
  watch: {
    name (name, oldName) {
      unregisterField(oldName, this)
      this.form = registerField(name, this)
    }
  },
  mounted () {
    this.form = registerField(this.name, this)
  },
  beforeUnmount () {
    unregisterField(this.name, this)
    this.form = null
  }
}
