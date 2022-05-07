import { shallowRef, ref, computed, unref, watch } from 'vue'
import { useUrl } from './url.js'

export function useFetchGet (urlParts, getParams, headers, options) {
  const status = ref(null)
  const isLoading = ref(false)
  const data = shallowRef(null)
  const errorHandlers = []

  function onError (handler) {
    errorHandlers.push(handler)
  }

  function emitError (error) {
    for (const errorHandler of errorHandlers) {
      errorHandler(error)
    }
  }

  const { url } = useUrl(urlParts, getParams)

  const internalHeaders = computed(() => {
    const values = {
      Accept: 'application/json'
    }
    const headersUnref = unref(headers)
    for (const name in headersUnref) {
      values[name] = unref(headersUnref[name])
    }
    return values
  })

  async function load () {
    status.value = null
    data.value = null
    isLoading.value = true

    let response = null
    try {
      response = await fetch(url.value, {
        headers: internalHeaders.value
      })

      const body = response.headers.has('content-type') &&
        response.headers.get('content-type').includes('application/json')
        ? await response.json()
        : await response.text()

      status.value = response.status

      if (response.ok) {
        data.value = body
      } else {
        emitError({
          type: 'badResponse',
          status: response.status,
          statusText: response.statusText,
          body
        })
      }
    } catch (exception) {
      emitError({
        type: 'exception',
        name: exception.name,
        message: exception.message
      })
    }

    isLoading.value = false
  }

  watch(
    [url, internalHeaders],
    () => !unref(unref(options)?.manual) && load(),
    { immediate: true }
  )

  return {
    status,
    isLoading,
    data,
    load,
    onError
  }
}
