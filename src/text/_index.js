/** @module text */

/**
 * @typedef {Object} TextNamespace
 * @property canvasWordWrap
 * @property clearCanvasWordWrapCache
 */

import { canvasWordWrap, clearCanvasWordWrapCache } from './canvasWordWrap.js'

/** @type {TextNamespace} */
export const text = {
  canvasWordWrap,
  clearCanvasWordWrapCache
}
