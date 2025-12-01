import { writeFile } from 'fs/promises'
import fetch from 'node-fetch'
import path from 'path'
import { fileURLToPath } from 'url'

const GEO_URL = 'https://api.nanpa.com/reports/public/npa/geographicUse'
const NON_GEO_URL = 'https://api.nanpa.com/reports/public/npa/nonGeographicUse'
// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.resolve(__dirname, '../src/validation/areaCodes.js');

const countryList = {
  NJ: 'US',
  DC: 'US',
  CT: 'US',
  AL: 'US',
  WA: 'US',
  ME: 'US',
  ID: 'US',
  CA: 'US',
  TX: 'US',
  NY: 'US',
  PA: 'US',
  OH: 'US',
  IL: 'US',
  MN: 'US',
  IN: 'US',
  LA: 'US',
  MD: 'US',
  MS: 'US',
  GA: 'US',
  MI: 'US',
  MO: 'US',
  FL: 'US',
  NC: 'US',
  WI: 'US',
  KY: 'US',
  VA: 'US',
  DE: 'US',
  CO: 'US',
  WV: 'US',
  WY: 'US',
  NE: 'US',
  KS: 'US',
  IA: 'US',
  AR: 'US',
  MA: 'US',
  VI: 'US',
  UT: 'US',
  RI: 'US',
  OK: 'US',
  MT: 'US',
  TN: 'US',
  OR: 'US',
  AZ: 'US',
  NM: 'US',
  NH: 'US',
  SD: 'US',
  GU: 'US',
  AS: 'US',
  ND: 'US',
  NV: 'US',
  PR: 'US',
  VT: 'US',
  SC: 'US',
  HI: 'US',
  AK: 'US',
  MANITOBA: 'CA',
  ONTARIO: 'CA',
  'BRITISH COLUMBIA': 'CA',
  QUEBEC: 'CA',
  SASKATCHEWAN: 'CA',
  ALBERTA: 'CA',
  'NEW BRUNSWICK': 'CA',
  'NEWFOUNDLAND AND LABRADOR': 'CA',
  'NOVA SCOTIA - PRINCE EDWARD ISLAND': 'CA',
  'NORTHWEST TERRITORIES -YUKON - NUNAVUT': 'CA',
  'TRINIDAD & TOBAGO': 'TT',
  'ST. KITTS & NEVIS': 'KN',
  BAHAMAS: 'BS',
  BARBADOS: 'BB',
  ANGUILLA: 'AI',
  'ANTIGUA/BARBUDA': 'AG',
  'BRITISH VIRGIN ISLANDS': 'VG',
  'CAYMAN ISLANDS': 'KY',
  BERMUDA: 'BM',
  GRENADA: 'GD',
  'TURKS & CAICOS ISLANDS': 'TC',
  JAMAICA: 'JM',
  MONTSERRAT: 'MS',
  CNMI: 'MP',
  'SINT MAARTEN': 'SX',
  'ST. LUCIA': 'LC',
  DOMINICA: 'DM',
  'ST. VINCENT & GRENADINES': 'VC',
  'DOMINICAN REPUBLIC': 'DO',
  'NON-GEOGRAPHIC SERVICES': 'US',
  'CANADIAN NON-GEOGRAPHIC TARIFFED SERVICES': 'CA',
  'CANADIAN NON-GEOGRAPHIC SERVICES': 'CA',
  'INTEREXCHANGE CARRIER SERVICES': 'US',
  'US GOVERNMENT': 'US',
  'TOLL-FREE': 'US',
  'PREMIUM SERVICES': 'US'
}

function countryLookup(location) {
  const lookupValue = location.toUpperCase().trim()
  if (!countryList[lookupValue]) {
    throw new Error(`Unknown location: ${lookupValue}`)
  }
  return countryList[lookupValue]
}

async function downloadAndProcessAreaCodes() {
  try {
    // 1. Download the files

    let geoData = {}
    let nonGeoData = {}

    await Promise.all([
      fetch(GEO_URL),
      fetch(NON_GEO_URL)
    ]).then(async ([geoResponse, nonGeoResponse]) => {
      if (!geoResponse.ok) {
        throw new Error(`Failed to fetch geographic file: ${geoResponse.statusText}`)
      }
      if (!nonGeoResponse.ok) {
        throw new Error(`Failed to fetch non-geographic file: ${nonGeoResponse.statusText}`)
      }
      geoData = await geoResponse.json()
      nonGeoData = await nonGeoResponse.json()
    })

    // 2. Process line by line
    const result = []

    result.push('/**\n')
    result.push(' * @module validation/areaCodes\n')
    result.push(' * @description North American Numbering Plan (NANP) Area Codes\n')
    result.push(' *   This file is auto-generated. Do not edit directly.\n')
    result.push(' *   To update, run the script at scripts/update-area-codes.js\n')
    result.push(' * @see {@link https://secure.nanpa.com/public-report/npa/geographic-use|NANPA}\n')
    result.push(' * @see {@link https://secure.nanpa.com/public-report/npa/nonGeographic-use|NANPA}\n')
    result.push('\n')
    result.push('/**\n')
    result.push(' * @type {Array<{code: string, location: string, country: string}>}\n')
    result.push(' * @constant\n')
    result.push(' */\n')
    result.push('const areaCodes = [\n')

    let i = 0
    // @ts-ignore
    const geoItems = geoData?.reportTemplate?.body?.cellRows
    while (i < geoItems.length - 1) {
      result.push(`  { code: '${geoItems[i].data}', location: '${geoItems[i + 1].data}', country : '${countryLookup(geoItems[i + 1].data)}' },\n`)
      i += 2
    }
    // @ts-ignore
    i = 0
    const nonGeoItems = nonGeoData?.reportTemplate?.body?.cellRows
    while (i < nonGeoItems.length - 1) {
      result.push(`  { code: '${nonGeoItems[i].data}', location: '${nonGeoItems[i + 1].data.toUpperCase().trim()}', country : '${countryLookup(nonGeoItems[i + 1].data)}' },\n`)
      i += 2
    }

    if (result[result.length - 1].endsWith(',\n')) {
      // remove trailing comma from last item
      result[result.length - 1] = result[result.length - 1].slice(0, -2) + '\n'
    }

    result.push(']\n')
    result.push('export { areaCodes }\n')

    // 3. Write to file (overwrite if exists)
    await writeFile(OUTPUT_PATH, result, 'utf8')
    console.log(`Processed file written to ${OUTPUT_PATH}`)

  } catch (err) {
    console.error('Error:', err.message)
  }
}

downloadAndProcessAreaCodes()