/** @module text/useCanvasWordWrap */

/**
 * @typedef {Object} WrapResult
 * @property {string[]} lines The lines of word-wrapped text.
 */

/**
 * @typedef {Object} useCanvasWordWrapResult
 * @property {(context: CanvasRenderingContext2D, baseText: string, maxWidth: number) => WrapResult} wrap
 */

/**
 * @description Factory function that provides a method to word-wrap text for Canvas rendering.
 *   Since calculations are expensive, results are memoized for fast lookup.
 *   This is useful when working with the Canvas API to render custom UI.
 * @memberof text
 * @module text/useCanvasWordWrap
 * @returns {useCanvasWordWrapResult} A canvas word wrap utility object.
 */
export function useCanvasWordWrap() {

  /**
   * @type { Map<string,string[]> }
   */
  const wordWrapLookup = new Map()

  /**
   * 
   * @param {CanvasRenderingContext2D} context The rendering context to measure text for.
   *   The context should have the font properties set before calling this function. 
   * @param {string} baseText A single string that is perhaps too long and needs to be word-wrapped.
   *   Any existing line breaks (\n) will be preserved.
   *   Non-breaking spaces (\u00A0) will be respected.
   * @param {number} maxWidth The width in pixels that the text has to fit in.
   * @example let lines = text.useCanvasWordWrap().wrap(context, 'word wrap this long text', 200);
   * @returns {WrapResult}
   */
  function wrap(context, baseText, maxWidth) {
    const result = { lines: [] }

    // check if already calculated
    const existing = wordWrapLookup.get(baseText + maxWidth + context.font)

    if (existing) {
      result.lines.push(...existing)
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

  return {
    wrap
  }
}
