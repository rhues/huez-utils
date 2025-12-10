/** @module text */

/**
 * @typedef {Object} TextNamespace
 * @property useCanvasWordWrap
 * @property useCamelCase
 */

import { useCanvasWordWrap } from './canvasWordWrap.js'
import { useCamelCase } from './camelCase.js'

/** @type {TextNamespace} */
export const text = {
  useCanvasWordWrap,
  useCamelCase
}
