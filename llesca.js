import { Odata, OdataEntity } from 'odata-tools'

export default class Llesca {
  constructor (apiUrl, schema, globalTypes) {
    const odata = new Odata(apiUrl)

    const entries = []
    for (const name in schema) {
      const { endpoint, properties, types } = schema[name]
      entries.push([name, new OdataEntity({
        odata,
        endpoint,
        properties,
        types: { ...globalTypes, ...types }
      })])
    }

    const endpoints = new Map(entries.map(([name, value]) => [value.endpoint, value]))

    Object.assign(this, Object.fromEntries([
      ['$odata', odata],
      ['$endpoints', endpoints],
      ...entries
    ]))
  }

  getEntityNameFromEndpoint (endpoint) {
    return this.endpo
  }
}
