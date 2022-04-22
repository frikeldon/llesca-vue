import { reactive, computed, unref } from 'vue'

export function useForm () {
  const fields = reactive(new Map())

  function createField (name, value) {
    fields.set(name, { value })
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
