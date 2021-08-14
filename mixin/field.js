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
    name: { type: String, required: true },
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
    this.form = ancestorOfType(CollectionField, this.$parent)
    this.form.registerField(this)
  },
  beforeUnmount () {
    this.form.unregisterField(this)
    this.form = null
  }
}
