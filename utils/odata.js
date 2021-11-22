/**
 * Crea un objeto URL a una URL.
 * @param {string,Array} urlParts URL del recurso como string o como Array con las partes a concatenar.
 * @param {object} [getParams] Parametros GET de la URL.
 * @returns Objeto URL.
 */
export function createUrl (urlParts, getParams = {}) {
  const joinedUrlParts = Array.isArray(urlParts)
    ? urlParts.reduce((accumulated, current) => {
      if (current == null) {
        return accumulated
      }
      const slashEnd = accumulated.endsWith('/')
      const slashStart = current.startsWith('/')
      if (slashEnd && slashStart) {
        return accumulated + current.substr(1)
      } else if (!slashEnd && !slashStart) {
        return accumulated + '/' + current
      } else {
        return accumulated + current
      }
    })
    : urlParts
  const url = new URL(joinedUrlParts)
  for (const name in getParams) {
    const value = getParams[name]
    if (value != null) {
      url.searchParams.append(name, getParams[name])
    }
  }
  return url
}

/**
 * Realiza una peticion GET y recupera la respuesta como JSON.
 * @param {string,Array} urlParts URL del recurso como string o como Array con las partes a concatenar.
 * @param {object} [getParams] Parametros GET de la URL.
 * @returns Objeto URL.
 */
export async function requestGet (urlParts, getParams, headers = []) {
  const url = createUrl(urlParts, getParams)
  const options = {
    headers: { Accept: 'application/json' },
    ...headers
  }
  const response = await fetch(url, options)
  if (response.ok) {
    return (await response.json())
  } else if (response.status === 400) {
    throw await response.json()
  } else {
    throw new Error()
  }
}

/**
 * Realiza una peticion POST enviando datos JSON al servidor y recupera la respuesta como JSON.
 * @param {string,Array} urlParts URL del recurso como string o como Array con las partes a concatenar.
 * @param {object} data Objecto JSON a enviar al servidor.
 * @param {object} [getParams] Parametros GET de la URL.
 * @returns Objeto URL.
 */
export async function requestPost (urlParts, data, getParams, headers = []) {
  const url = this.createUrl(urlParts, getParams)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers
    },
    body: JSON.stringify(data)
  }
  const response = await fetch(url, options)
  if (response.ok) {
    return (await response.json())
  } else if (response.status === 400) {
    throw await response.json()
  } else {
    throw new Error()
  }
}

/**
 * Realiza una peticion POST enviando datos JSON al servidor y recupera la respuesta y si existe la interpreta como JSON.
 * @param {string,Array} urlParts URL del recurso como string o como Array con las partes a concatenar.
 * @param {object} data Objecto JSON a enviar al servidor.
 * @param {object} [getParams] Parametros GET de la URL.
 * @returns Objeto URL.
 */
export async function requestPut (urlParts, data, getParams, headers = []) {
  const url = this.createUrl(urlParts, getParams)
  const options = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers
    },
    body: JSON.stringify(data)
  }
  const response = await fetch(url, options)
  if (response.ok) {
    const text = await response.text()
    return text ? JSON.parse(text) : null
  } else if (response.status === 400) {
    throw await response.json()
  } else {
    throw new Error()
  }
}

/**
 * Realiza una peticion DELETE y recupera la respuesta y si existe la interpreta como JSON.
 * @param {string,Array} urlParts URL del recurso como string o como Array con las partes a concatenar.
 * @param {object} [getParams] Parametros GET de la URL.
 * @returns Objeto URL.
 */
export async function requestDelete (urlParts, getParams, headers = []) {
  const url = this.createUrl(urlParts, getParams)
  const options = {
    method: 'DELETE',
    headers: { Accept: 'application/json' },
    ...headers
  }
  const response = await fetch(url, options)
  if (response.ok) {
    const text = await response.text()
    return text ? JSON.parse(text) : null
  } else if (response.status === 400) {
    throw await response.json()
  } else {
    throw new Error()
  }
}
