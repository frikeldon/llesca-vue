import { ref, reactive, computed, unref, isRef, watch } from 'vue'

export function useValidations () {
  const fields = reactive(new Map())
  const validations = reactive(new Map())
  const changeHandlers = []

  function onChange (handler) {
    changeHandlers.push(handler)
  }

  function emitChange (event) {
    for (const handler of changeHandlers) {
      handler(event)
    }
  }

  const formValues = computed(() => Object.fromEntries(
    Array.from(fields.entries()).map(([name, { value }]) =>
      [name, unref(value)]
    )
  ))

  function createField (name, value, { rules, skip } = {}) {
    const errorMessage = ref(null)

    async function validate (...args) {
      errorMessage.value = null
      const rulesUnref = unref(rules)
      if (rulesUnref && !unref(skip)) {
        for (const rule of rulesUnref) {
          const maybePromise = rule(unref(value), unref(formValues), ...args)
          const result = maybePromise instanceof Promise
            ? await maybePromise
            : maybePromise
          if (result && typeof result === 'string') {
            errorMessage.value = result
            return false
          }
        }
      }
      return true
    }

    function clean () {
      errorMessage.value = null
    }

    function destroy () {
      fields.delete(name)
    }

    fields.set(name, { value, validate, clean })

    watch(value, (value, oldValue) => {
      errorMessage.value = null
      emitChange({ name, value, oldValue })
    })

    return {
      errorMessage: isRef(skip)
        ? computed(() => skip.value ? null : unref(errorMessage))
        : errorMessage,
      destroy,
      validate,
      clean
    }
  }

  function createValidation (name, { rules, skip } = {}) {
    const errorMessage = ref(null)

    async function validate (...args) {
      errorMessage.value = null
      const rulesUnref = unref(rules)
      if (rulesUnref && !unref(skip)) {
        for (const rule of rulesUnref) {
          const maybePromise = rule(unref(formValues), ...args)
          const result = maybePromise instanceof Promise
            ? await maybePromise
            : maybePromise
          if (result && typeof result === 'string') {
            errorMessage.value = result
            return false
          }
        }
      }
      return true
    }

    function clean () {
      errorMessage.value = null
    }

    function destroy () {
      validations.delete(name)
    }

    validations.set(name, { validate, clean })

    return {
      errorMessage: isRef(skip)
        ? computed(() => skip.value ? null : unref(errorMessage))
        : errorMessage,
      destroy,
      validate,
      clean
    }
  }

  async function validate (...args) {
    let isValid = true
    for (const { validate } of fields.values()) {
      isValid = await validate(...args) && isValid
    }
    for (const { validate } of validations.values()) {
      isValid = await validate(...args) && isValid
    }
    return isValid
  }

  function clean () {
    for (const { clean } of fields.values()) {
      clean()
    }
    for (const { clean } of validations.values()) {
      clean()
    }
  }

  return {
    fields: computed(() => Array.from(fields.keys())),
    validations: computed(() => Array.from(validations.keys())),
    values: formValues,
    createField,
    createValidation,
    validate,
    clean,
    onChange
  }
}
