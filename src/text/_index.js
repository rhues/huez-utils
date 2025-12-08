/** @module text */

/**
 * @typedef {Object} TextNamespace
 * @property canvasWordWrap
 * @property clearCanvasWordWrapCache
 * @property useCamelCase
 */

import { canvasWordWrap, clearCanvasWordWrapCache } from './canvasWordWrap.js'
import { useCamelCase } from './camelCase.js'

/** @type {TextNamespace} */
export const text = {
  canvasWordWrap,
  clearCanvasWordWrapCache,
  useCamelCase
}
