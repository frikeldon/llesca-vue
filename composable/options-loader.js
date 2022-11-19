import { reactive, computed, watchEffect, unref } from 'vue'
import { useFetchGet } from './fetch-get.js'

export function useOptionsLoader (apiUrl, entityName, valueKey, textKey, getParams, headers) {
  const valueKeyUnref = unref(valueKey)
  const textKeyUnref = unref(textKey)
  const getParamsUnref = unref(getParams)

  const internalGetParams = reactive({})
  watchEffect(() => {
    const currentSelect = `${valueKeyUnref},${textKeyUnref}`
    if (internalGetParams.$select !== currentSelect) {
      internalGetParams.$select = currentSelect
    }

    if (internalGetParams.$orderby !== textKeyUnref) {
      internalGetParams.$orderby = textKeyUnref
    }

    for (const name in getParamsUnref) {
      const currentParam = unref(getParamsUnref[name])
      if (internalGetParams[name] !== currentParam) {
        internalGetParams[name] = currentParam
      }
    }

    for (const name in internalGetParams) {
      if (!['$orderby', '$select', ...Object.keys(getParamsUnref)].includes(name)) {
        delete internalGetParams[name]
      }
    }
  })

  const { status, isLoading, data, error, load } = useFetchGet([apiUrl, entityName], internalGetParams, headers)

  const options = computed(() => {
    const rows = data.value?.value || []
    return rows.map(row => ({
      value: row[valueKeyUnref],
      text: row[textKeyUnref]
    }))
  })

  return { status, isLoading, options, error, load }
}
