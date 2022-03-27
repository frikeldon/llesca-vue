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
     * @property {object} event Propiedades del evento.
     * @property {object} event.name Nombre del campo que cambia de valor.
     * @property {object} event.newValue Nuevo valor del campo.
     * @property {object} event.oldValue Antiguo valor del campo.
     */
    'change'
  ],
  data () {
    return { fields: new Map() }
  },
  methods: {
    /**
     * Valida los campos del formulario y recupera los errores.
     * @param {object} options Opciones de la validacion.
     * @returns {object} errores del formulario.
     *   La propiedad form contiene el mensaje de error del formulario.
     *   La propiedad fields contiene una lista con los campos erroneos.
     *   Si no hay errores, el valor devuelto es null.
     * @public
     */
    async checkErrors (options) {
      const fieldEntries = Array.from(this.fields.entries())
      const fieldStates = await Promise.all(
        fieldEntries.map(entry => entry[1].field.validate?.(options))
      )

      const fields = []
      let isValid = true
      for (let index = 0; index < fieldStates.length; index += 1) {
        if (!fieldStates[index]) {
          isValid = false
          fields.push(fieldEntries[index][0])
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
      const fieldEntries = Array.from(this.fields.entries())
      const valueEntries = fieldEntries.map(([name, { field }]) => [name, field.modelValue])
      return Object.fromEntries(valueEntries)
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
    loadData () {
      return Promise.all(
        Array.from(this.fields.entries())
          .map(([, { field }]) => field.loadData?.())
      )
    },
    registerField (name, field) {
      if (!name || typeof name !== 'string') {
        console.error('Invalid field.')
      } else {
        if (this.fields.has()) {
          console.warn(`Field '${name}' is already registered in the collection`)
        }
        const unwatch = field.$watch('modelValue', (newValue, oldValue) => {
          this.$emit('change', { name, newValue, oldValue })
        })
        this.fields.set(name, { field, unwatch })
      }
    },
    unregisterField (name) {
      if (!this.fields.has(name)) {
        console.warn(`Field '${name}' not found in the collection`)
      } else {
        const { unwatch } = this.fields.get(name)
        unwatch()
        this.fields.delete(name)
      }
    }
  }
}
</script>

<template>
  <slot />
</template>
