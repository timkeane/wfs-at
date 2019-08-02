require('dotenv').config()

const WFS_ENDPOINT = process.env.WFS_ENDPOINT || 'http://localhost:8080/geoserver/wfs/'
const LAYER = 'TAXLOT'
const GEOM_COL = 'SHAPE'
const DATA_PROJ = 'EPSG:2263'
const COORD_AT_2_MTC = [-8236095, 4967234]

const wfsAt = require('../index')

const options = {
  coordinate: COORD_AT_2_MTC,
  wfsEndpoint: WFS_ENDPOINT,
  layer: LAYER,
  geometryColumn: GEOM_COL,
  dataProjection: DATA_PROJ
}

test('wfsAt success', done => {
  expect.assertions(1)
  wfsAt(options).then(features => {
    expect(features.features.length).toBe(1)
    done()
  })
})
