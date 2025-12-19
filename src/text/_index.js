/** @module text */

/**
 * @typedef {Object} TextNamespace
 * @property useCanvasWordWrap
 * @property useCamelCase
 * @property fitText
 * @property drawText
 */

import { useCanvasWordWrap } from './canvasWordWrap.js'
import { useCamelCase } from './camelCase.js'
import { fitText, drawText } from './canvasTextFit.js'

/** @type {TextNamespace} */
export const text = {
  useCanvasWordWrap,
  useCamelCase,
  fitText,
  drawText
}
