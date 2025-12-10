/** @module text/useCamelCase */

/**
 * @typedef {Object} UseCamelCaseResult
 * @property {(str: String) => String} toCamelCase
 * @property {(obj: Object|Array) => Object|Array} keysToCamelCase
 */

/**
 * @description Factory function that provides methods to convert strings to camelCase
 *   and to convert all keys in an object or array to camelCase.
 *   Uses internal caching for performance.
 *   No higher-order functions and no regex for performance reasons.
 * @memberof text
 * @module text/useCamelCase
 * @returns {UseCamelCaseResult} A camelCase utility object.
 */
export function useCamelCase() {

  // Internal cache for camelCased strings to improve performance on repeated keys
  const lookup = new Map()

  /**
   * Converts a string to camelCase.
   * Example: 'hello_world' => 'helloWorld'
   * @module text/useCamelCase
   * @memberof text/useCamelCase
   * @param {String} str - The input string to convert.
   * @returns {String} The camelCased string.
   */
  function toCamelCase(str) {
    const existing = lookup.get(str)
    if (existing) {
      return existing
    }
    let result = ''
    let upper = false
    for (let i = 0; i < str.length; i++) {
      if (str[i] === '_' && i === 0) {
        // skip leading underscore
        continue
      }
      if (str[i] === '_') {
        upper = true
      } else if (upper) {
        result += str[i].toUpperCase()
        upper = false
      } else {
        result += str[i]
      }
    }
    lookup.set(str, result)
    return result
  }

  /**
   * Converts all keys in an object or array to camelCase.
   * Handles nested objects and arrays.
   * Uses internal cache for performance.
   * @module text/useCamelCase
   * @memberof text/useCamelCase
   * @param {Object|Array} obj - The object or array to convert.
   * @returns {Object|Array} New object or array with camelCased keys.
   * @example keysToCamelCase({ test_key: 'value', nested_object: { another_key: 123 }, _yu: [ { i_d:1 }, { i_d:2 } ] })
   *   --> { testKey: 'value', nestedObject: { anotherKey: 123 }, yu: [ { iD:1 }, { iD:2 } ] }
   */
  function keysToCamelCase(obj) {
    if (Array.isArray(obj)) {
      const arr = new Array(obj.length)
      for (let i = 0; i < obj.length; i++) {
        arr[i] = keysToCamelCase(obj[i])
      }
      return arr
    } else if (obj && typeof obj === 'object' && obj.constructor === Object) {
      const newObj = {}
      for (const k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          newObj[toCamelCase(k)] = keysToCamelCase(obj[k])
        }
      }
      return newObj
    }
    return obj
  }

  return {
    toCamelCase,
    keysToCamelCase
  }
}
