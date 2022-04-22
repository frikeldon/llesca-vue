import { ref, reactive, computed, unref } from 'vue'

export function useForm () {
  const fields = reactive(new Map())

  function createField (name, value, { rules } = {}) {
    const errorMessage = ref(null)

    function destroy () {
      fields.delete(name)
    }

    function validate () {
      errorMessage.value = null
      const rulesUnref = unref(rules)
      if (rulesUnref) {
        for (const rule of rulesUnref) {
          const result = rule(unref(value))
          if (result && typeof result === 'string') {
            errorMessage.value = result
            return false
          }
        }
      }
      return true
    }

    fields.set(name, { value })

    return {
      errorMessage,
      destroy,
      validate
    }
  }

  return {
    fields: computed(() => [...fields.keys()]),
    values: computed(() => Object.fromEntries(
      [...fields.entries()].map(([name, { value }]) =>
        [name, unref(value)]
      )
    )),
    createField
  }
}
