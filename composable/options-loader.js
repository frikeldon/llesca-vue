import { computed, unref } from 'vue'
import { useFetchGet } from './fetch-get.js'

export function useOptionsLoader (apiUrl, entityName, valueKey, textKey, getParams, headers) {
  const valueKeyUnref = unref(valueKey)
  const textKeyUnref = unref(textKey)
  const getParamsUnref = unref(getParams)

  const internalGetParams = computed(() => {
    const params = {}
    params.$orderby = textKeyUnref
    for (const name in getParamsUnref) {
      params[name] = unref(getParamsUnref[name])
    }
    params.$select = `${valueKeyUnref},${textKeyUnref}`
    return params
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
