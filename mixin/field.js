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
  mounted () {
    if (this.name !== null) {
      this.form = ancestorOfType(CollectionField, this.$parent)
      if (this.form) {
        this.form.registerField(this)
      }
    }
  },
  beforeUnmount () {
    if (this.form) {
      this.form.unregisterField(this)
      this.form = null
    }
  }
}
