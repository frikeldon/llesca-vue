import { ref, watchEffect, unref } from 'vue'

export function useUrl (urlParts, getParams) {
  const url = ref('')

  watchEffect(() => {
    const urlPartsUnref = unref(urlParts)

    const joinedUrlParts = Array.isArray(urlPartsUnref)
      ? urlPartsUnref.reduce((accumulated, current) => {
        const accumulatedUnref = unref(accumulated)
        const currentUnref = unref(current)
        if (currentUnref == null) {
          return accumulatedUnref
        }
        const slashEnd = accumulatedUnref.endsWith('/')
        const slashStart = currentUnref.startsWith('/')
        if (slashEnd && slashStart) {
          return accumulatedUnref + currentUnref.substr(1)
        } else if (!slashEnd && !slashStart) {
          return accumulatedUnref + '/' + currentUnref
        } else {
          return accumulatedUnref + currentUnref
        }
      })
      : urlPartsUnref

    const currentUrl = new URL(joinedUrlParts)

    const getParamsUnref = unref(getParams)
    for (const name in getParamsUnref) {
      const value = unref(getParamsUnref[name])
      if (value != null) {
        currentUrl.searchParams.append(name, getParamsUnref[name])
      }
    }

    if (currentUrl.toString() !== url.value.toString()) {
      url.value = currentUrl
    }
  })

  return { url }
}
