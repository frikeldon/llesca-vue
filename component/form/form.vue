<script>
export default {
  name: 'LlescaForm',
  props: {
    /**
     * Método para validar el campo. El método puede ser asincrono.
     * @param {string} values El valor actual del campo.
     * @param {object} options Opciones con las que se llama al metodo "validate".
     * @returns {string} Si el valor del campo es válido,el metodo debe devolver null. Si el valor del campo no es válido, el metodo debe devolver un texto con la descripción del error.
     */
    validator: { type: Function, default: () => null }
  },
  emits: [
    /**
     * Se genera cuando algun campo cambia de valor.
     * @property {object} props Propiedades del evento.
     * @property {object} props.name Nombre del campo que cambia de valor.
     * @property {object} props.newValue Nuevo valor del campo.
     * @property {object} props.oldValue Antiguo valor del campo.
     */
    'change'
  ],
  data () {
    return { fields: new Map() }
  },
  methods: {
    /**
     * Recupera los errores del formulario.
     * @param {object} options Opciones de la validacion.
     * @returns {object} errores del formulario.
     *   La propiedad form contiene el mensaje de error del formulario.
     *   La propiedad fields contiene una lista con los campos erroneos.
     *   Si no hay errores, el valor devuelto es null.
     * @public
     */
    async checkErrors (options) {
      const fields = []
      const entires = [...this.fields.entries()]
      const states = await Promise.all(entires.map(entry => entry[1].field.validate(options)))

      let isValid = true
      for (let index = 0; index < states.length; index += 1) {
        if (!states[index]) {
          isValid = false
          fields.push(entires[index][0])
        }
      }

      const form = await this.validator(this.getValues(), options)

      return isValid && !form
        ? null
        : { form, fields }
    },
    /**
     * Recupera los valores de los campos.
     * @returns {object} Objecto con los valores de cada campo.
     * @public
     */
    getValues () {
      const fieldsEntries = [...this.fields.entries()]
      const valuesEntries = fieldsEntries.map(([name, { field }]) => [name, field.modelValue])
      return Object.fromEntries(valuesEntries)
    },
    /**
     * Asigna valores a los campos.
     * @param {object} options Valores a asignar.
     * @public
     */
    updateValues (data) {
      for (const name in data) {
        const field = this.fields.get(name)
        if (field) {
          field.updateValue(data[name])
        }
      }
    },
    /**
     * Llama al metodo de cargar datos de todos los campos del formulario
     * @returns {Promise} Una promesa que se resuelve cuando todos los datos estan cargados.
     * @public
     */
    async loadData () {
      for (const [, { field }] of this.fields) {
        await field.loadData?.()
      }
    },
    registerField (field) {
      if (!field.name || typeof field.name !== 'string') {
        console.error('Invalid field.')
      } else {
        if (this.fields.has()) {
          console.warn(`Field '${field.name}' is already registered in the collection`)
        }
        const unwatch = field.$watch('modelValue', (newValue, oldValue) =>
          this.$emit('change', { name: field.name, newValue, oldValue }))
        this.fields.set(field.name, { field, unwatch })
      }
    },
    unregisterField (field) {
      if (!this.fields.has(field.name)) {
        console.warn(`Field '${field.name}' not found in the collection`)
      } else {
        const unwatch = this.fields.get(field.name)
        unwatch()
        this.fields.delete(field.name)
      }
    }
  }
}
</script>

<template>
  <slot />
</template>
