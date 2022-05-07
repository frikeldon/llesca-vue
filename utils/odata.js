class HttpResponseError extends Error {
  constructor (response, body) {
    super(`Bad HTTP response status ${response.statusText}'`)
    this.name = 'HttpError'
    this.status = response.status
    this.statusText = response.statusText
    this.body = body
  }
}

class HttpBatchResponseError extends Error {
  constructor (response, responses) {
    super(`Bad HTTP response status ${response.statusText}'`)
    this.name = 'HttpError'
    this.status = response.status
    this.statusText = response.statusText
    this.responses = responses
  }
}

function getHeaders (headers = {}, { withContent = false, withAccept = false } = {}) {
  return Object.assign(
    {},
    withContent ? { 'Content-Type': 'application/json' } : {},
    withAccept ? { Accept: 'application/json' } : {},
    headers
  )
}

async function handleResponse (response) {
  const body = response.headers.has('content-type') &&
  response.headers.get('content-type').includes('application/json')
    ? await response.json()
    : await response.text()

  if (response.ok) {
    return body
  } else {
    throw new HttpResponseError(response, body)
  }
}

/**
 * Crea un objeto URL a una URL.
 * @param {string,Array} urlParts URL del recurso como string o como Array con las partes a concatenar.
 * @param {object} [getParams] Parametros GET de la URL.
 * @returns Objeto URL.
 */
export function createUrl (urlParts, getParams = {}) {
  const joinedUrlParts = urlParts.reduce((accumulated, current) => {
    if (current == null) return accumulated
    if (accumulated == null) return current

    const slashEnd = accumulated.endsWith('/')
    const slashStart = current.startsWith('/')
    if (slashEnd && slashStart) {
      return accumulated + current.substr(1)
    } else if (!slashEnd && !slashStart) {
      return accumulated + '/' + current
    } else {
      return accumulated + current
    }
  }, null)

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
 * @param {object} [headers] Cabeceras HTTP de la peticion.
 * @returns Respuesta del servidor.
 */
export async function requestGet (urlParts, getParams, headers) {
  const url = createUrl(urlParts, getParams)
  const options = {
    headers: {
      ...getHeaders(headers, { withAccept: true }),
      ...headers
    }
  }
  const response = await fetch(url, options)
  return await handleResponse(response)
}

/**
 * Realiza una peticion POST enviando datos JSON al servidor y recupera la respuesta como JSON.
 * @param {string,Array} urlParts URL del recurso como string o como Array con las partes a concatenar.
 * @param {object} data Objecto JSON a enviar al servidor.
 * @param {object} [getParams] Parametros GET de la URL.
 * @param {object} [headers] Cabeceras HTTP de la peticion.
 * @returns Respuesta del servidor.
 */
export async function requestPost (urlParts, data, getParams, headers) {
  const url = createUrl(urlParts, getParams)
  const options = {
    method: 'POST',
    headers: {
      ...getHeaders(headers, { withContent: true, withAccept: true }),
      ...headers
    },
    body: JSON.stringify(data)
  }
  const response = await fetch(url, options)
  return await handleResponse(response)
}

/**
 * Realiza una peticion PUT enviando datos JSON al servidor y recupera la respuesta y si existe la interpreta como JSON.
 * @param {string,Array} urlParts URL del recurso como string o como Array con las partes a concatenar.
 * @param {object} data Objecto JSON a enviar al servidor.
 * @param {object} [getParams] Parametros GET de la URL.
 * @param {object} [headers] Cabeceras HTTP de la peticion.
 * @returns Respuesta del servidor.
 */
export async function requestPut (urlParts, data, getParams, headers) {
  const url = createUrl(urlParts, getParams)
  const options = {
    method: 'PUT',
    headers: {
      ...getHeaders(headers, { withContent: true, withAccept: true }),
      ...headers
    },
    body: JSON.stringify(data)
  }
  const response = await fetch(url, options)
  return await handleResponse(response)
}

/**
 * Realiza una peticion PATCH enviando datos JSON al servidor y recupera la respuesta y si existe la interpreta como JSON.
 * @param {string,Array} urlParts URL del recurso como string o como Array con las partes a concatenar.
 * @param {object} data Objecto JSON a enviar al servidor.
 * @param {object} [getParams] Parametros GET de la URL.
 * @param {object} [headers] Cabeceras HTTP de la peticion.
 * @returns Respuesta del servidor.
 */
export async function requestPatch (urlParts, data, getParams, headers) {
  const url = createUrl(urlParts, getParams)
  const options = {
    method: 'PATCH',
    headers: {
      ...getHeaders(headers, { withContent: true, withAccept: true }),
      ...headers
    },
    body: JSON.stringify(data)
  }
  const response = await fetch(url, options)
  return await handleResponse(response)
}

/**
 * Realiza una peticion DELETE y recupera la respuesta y si existe la interpreta como JSON.
 * @param {string,Array} urlParts URL del recurso como string o como Array con las partes a concatenar.
 * @param {object} [getParams] Parametros GET de la URL.
 * @param {object} [headers] Cabeceras HTTP de la peticion.
 * @returns Respuesta del servidor.
 */
export async function requestDelete (urlParts, getParams, headers) {
  const url = createUrl(urlParts, getParams)
  const options = {
    method: 'DELETE',
    headers: {
      ...getHeaders(headers, { withAccept: true }),
      ...headers
    }
  }
  const response = await fetch(url, options)
  return await handleResponse(response)
}

/**
 * Realiza una peticion $batch
 * @param {Array} requests Definicion de las peticiones a realizar
 * @param {object} [headers] Cabeceras HTTP a añadir a cada deficion de peticion.
 * @returns Respuesta del servidor.
 */
export async function requestBatch (path, requests, headers) {
  const batchPath = path + (path.endsWith('/') ? '$batch' : '/$batch')
  const response = await fetch(batchPath, {
    method: 'POST',
    headers: getHeaders(null, { withContent: true, withAccept: true }),
    body: JSON.stringify({
      requests: requests.map(request => ({
        ...request,
        headers: {
          ...getHeaders(headers, { withContent: true, withAccept: true }),
          ...(request.headers || {})
        }
      }))
    })
  })
  const { responses } = await handleResponse(response)
  const withError = responses.find(response => !(response.status >= 200 && response.status < 300))
  if (withError) {
    throw new HttpBatchResponseError(withError, responses)
  }
}
