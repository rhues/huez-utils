
import { writeFile } from 'fs/promises'
import fetch from 'node-fetch'
import path from 'path'
import { fileURLToPath } from 'url'
import punycode from 'punycode/punycode.es6.js'

const FILE_URL = 'https://data.iana.org/TLD/tlds-alpha-by-domain.txt'
// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.resolve(__dirname, '../src/validation/tlds.js');

let lineLength = 0

function processTld(line, result, index) {
  if (lineLength > 70) {
    result.push('\n  ')
    lineLength = 0
  }

  const item = `"${line.trim().toUpperCase()}",`
  lineLength += item.length
  result.push(item)
  
  if (line.startsWith('XN--')) {
    if (lineLength > 70) {
      result.push('\n  ')
      lineLength = 0
    }

    const punyLine = `"${punycode.decode(line.substring(4)).toUpperCase()}",`
    lineLength += punyLine.length
    result.push(punyLine)
  }
}

async function downloadAndProcessTlds() {
  try {
    // 1. Download the file
    const response = await fetch(FILE_URL)
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`)
    }
    const text = await response.text()
    const lines = text.split('\n')

    // 2. Process line by line
    const result = []

    result.push(' /**\n')
    result.push('  * @module validation/tlds\n')
    result.push('  * @description IANA Top-Level Domain list\n')
    result.push('  *   which includes standard, international, and punycode TLDs, normalized to upper case.\n')
    result.push('  *   This file is auto-generated. Do not edit directly.\n')
    result.push('  *   To update, run the script at scripts/update-tlds.js\n')
    result.push('  * @see {@link https://data.iana.org/TLD/tlds-alpha-by-domain.txt|IANA TLDs}\n')
    result.push('  * ' + lines[0] + '\n')
    result.push('  */\n')
    result.push('export default new Set([\n  ')

    lines.forEach((line, index) => {
      if (index > 0 && line.length > 0) {
        processTld(line, result, index)
      }
    })

    if (result[result.length - 1].endsWith(',')) {
      // remove trailing comma from last item
      result[result.length - 1] = result[result.length - 1].slice(0, -1)
    }

    result.push('\n])\n')

    // 3. Write to file (overwrite if exists)
    await writeFile(OUTPUT_PATH, result, 'utf8')
    console.log(`Processed file written to ${OUTPUT_PATH}`)
  } catch (err) {
    console.error('Error:', err.message)
  }
}

downloadAndProcessTlds()
