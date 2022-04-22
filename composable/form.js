import { reactive, computed, unref } from 'vue'

export function useForm () {
  const fields = reactive(new Map())

  function createField (name, value) {
    function destroy () {
      fields.delete(name)
    }

    fields.set(name, { value })

    return {
      destroy
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
