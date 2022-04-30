import { ref, reactive, computed, unref, isRef, watch } from 'vue'

export function useValidations () {
  const fields = reactive(new Map())
  const validations = reactive(new Map())

  const formValues = computed(() => Object.fromEntries(
    [...fields.entries()].map(([name, { value }]) =>
      [name, unref(value)]
    )
  ))

  function createField (name, value, { rules, skip } = {}) {
    const errorMessage = ref(null)

    async function validate () {
      errorMessage.value = null
      const rulesUnref = unref(rules)
      if (rulesUnref && !unref(skip)) {
        for (const rule of rulesUnref) {
          const maybePromise = rule(unref(value), unref(formValues))
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

    watch(value, () => { errorMessage.value = null })

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

    async function validate () {
      errorMessage.value = null
      const rulesUnref = unref(rules)
      if (rulesUnref && !unref(skip)) {
        for (const rule of rulesUnref) {
          const maybePromise = rule(unref(formValues))
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

  async function validate () {
    let isValid = true
    for (const { validate } of fields.values()) {
      isValid = await validate() && isValid
    }
    for (const { validate } of validations.values()) {
      isValid = await validate() && isValid
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
    fields: computed(() => [...fields.keys()]),
    validations: computed(() => [...validations.keys()]),
    values: formValues,
    createField,
    createValidation,
    validate,
    clean
  }
}
