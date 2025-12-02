/** @module text/canvasWordWrap */

/**
 * @type { Map<string,string[]> }
 */
const wordWrapLookup = new Map()

/**
 * @typedef {Object} canvasWordWrapResult
 * @property {string[]} lines The lines of word-wrapped text.
 * @property {boolean}  fromCache Whether the result was retrieved from cache. 
 */

/**
 * @description Splits text into lines to fit within a certain width, like a word processor would.
 *   Since calculations are expensive, results are memoized for fast lookup.
 *   This is useful when working with the Canvas API to render custom UI.
 * @memberof text
 * @param {CanvasRenderingContext2D} context The rendering context to measure text for.
 *   The context should have the font properties set before calling this function.
 * @param {string} baseText A single string that is perhaps too long and needs to be word-wrapped.
 *   Any existing line breaks (\n) will be preserved.
 *   Non-breaking spaces (\u00A0) will be respected.
 * @param {number} maxWidth The width in pixels that the text has to fit in.
 * @example let lines = text.canvasWordWrap(context, 'word wrap this long text', 200);
 * @returns {canvasWordWrapResult}
 */
export function canvasWordWrap(context, baseText, maxWidth) {
  const result = { lines: [], fromCache: false }

  // check if already calculated
  const existing = wordWrapLookup.get(baseText + maxWidth + context.font)
  if (existing) {
    result.lines.push(...existing)
    result.fromCache = true
    return result
  }

  // apply line break characters (\n) by splitting up lines
  const lineBreakLines = baseText.split('\n')

  lineBreakLines.forEach(lineBreakLine => {

    // then split tokens by regular space characters
    const tokens = lineBreakLine.split(' ')
    let line = ''

    tokens.forEach(function(token) {
      let lineAndToken = line + ' ' + token
      if (context.measureText(lineAndToken.trim()).width > maxWidth) {
        if (line.length > 0) {
          result.lines.push(line)
        }
        line = token
      } else {
        line = lineAndToken.trim()
      }
    })

    if (line.length > 0) {
      result.lines.push(line)
    }
  })

  wordWrapLookup.set(baseText + maxWidth + context.font, result.lines)
  return result
}

/**
 * @description Clears the cached word wrap data.
 */
export function clearCanvasWordWrapCache() {
  wordWrapLookup.clear()
}