const DEFAULT_QRY = 'service=WFS&version=2.0.0&request=GetFeature&typeNames=${layer}&srsName=${outputProjection}&outputFormat=application/json&cql_filter=INTERSECTS(${geometryColumn},POINT(${x} ${y}))'
const DEFAULT_PROJ = 'EPSG:3857'

const proj4 = require('proj4')
const fetch = require('node-fetch')

proj4.defs([
  ['EPSG:2263', '+proj=lcc +lat_1=41.03333333333333 +lat_2=40.66666666666666 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000.0000000001 +y_0=0 +ellps=GRS80 +datum=NAD83 +units=ft +to_meter=0.3048006096012192 +no_defs'],
  ['EPSG:6539', '+proj=lcc +lat_1=40.66666666666666 +lat_2=41.03333333333333 +lat_0=40.16666666666666 +lon_0=-74 +x_0=300000 +y_0=0 +ellps=GRS80 +units=us-ft +no_defs']
])

const defaults = (options) => {
  if (!options.wfsEndpoint) {
    throw 'options must contain a wfsEnpoint'
  }
  options.queryTemplate = options.queryTemplate || DEFAULT_QRY
  options.inputProjection = options.inputProjection || DEFAULT_PROJ
  options.dataProjection = options.dataProjection || DEFAULT_PROJ
  options.outputProjection = options.outputProjection || DEFAULT_PROJ
}

const projected = (options) => {
  if (options.inputProjection !== options.dataProjection) {
    return proj4(options.inputProjection, options.dataProjection, options.coordinate)
  }
  return options.coordinate
}

const url = (options) => {
  let query = options.queryTemplate
  const coordinate = proj4(options.inputProjection, options.dataProjection, options.coordinate)
  query = query.replace(/\$\{layer\}/g, options.layer)
  query = query.replace(/\$\{geometryColumn\}/g, options.geometryColumn)
  query = query.replace(/\$\{outputProjection\}/g, options.outputProjection)
  query = query.replace(/\$\{x\}/g, coordinate[0])
  query = query.replace(/\$\{y\}/g, coordinate[1])
  return `${options.wfsEndpoint}?${query}`
}

module.exports = (options) => {
  defaults(options)
  return new Promise((resolve, reject) => {
    fetch(url(options)).then(response => {
      response.json().then(features => {
        resolve(features)
      }).catch(error => {
        reject(error)
      })
    }).catch(error => {
      reject(error)
    })
  })
}