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
    modelValue: { type: null, default: undefined }
  },
  emits: [
    /** Se genera cuando el usuario realiza una alteración en el valor del campo. */
    'update:modelValue'
  ],
  data () {
    return { form: null }
  },
  methods: {
    validate () { return true },
    updateValue (value) {
      this.$emit('update:modelValue', value)
    },
    loadData () {}
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
