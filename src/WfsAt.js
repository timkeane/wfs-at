import proj4 from 'proj4'

const DEFAULT_QRY = 'service=WFS&version=2.0.0&request=GetFeature&typeNames=${layer}&outputFormat=application/json&cql_filter=INTERSECTS(${geomColumn},POINT(${x} ${y}))'
const DEFAULT_PROJ = 'EPSG:3857'

const options = (options) => {
  if (!options.wfsEndpoint) {
    throw 'options must contain a wfsEnpoint'
  }
  options.queryTemplate = options.queryTemplate || DEFAULT_QRY
  options.inputProjection = options.inputProjection || DEFAULT_PROJ
  options.dataProjection = options.dataProjection || DEFAULT_PROJ
}

const url = (coordinate, options) => {
  let query = options.queryTemplate
  const projected = proj4(options.inputProjection, options.dataProjection, coordinate)
  query = query.replace(new RegExp('\\$\\{layer\\}', 'g'), options.layer)
  query = query.replace(new RegExp('\\$\\{x\\}', 'g'), projected[0])
  query = query.replace(new RegExp('\\$\\{y\\}', 'g'), projected[1])
  return `${options.wfsEndpoint}?${query}`
}

export default (coordinate, options) => {
  options(options)
  return new Promise((resolve, reject) => {
    fetch(url(coordinate, options)).then(response => {
      response.json().then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  })
}