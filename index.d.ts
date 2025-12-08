/**
 * Represents a single validation error.
 */
export interface ValidationError {
  code?: string;
  message?: string;
}

/**
 * Represents the result of a validation operation, shared across all validators.
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Represents the result of the canvasWordWrap function.
 */
export interface canvasWordWrapResult {
  lines: string[];
  fromCache: boolean;
}

export interface useCamelCaseFactoryResult {
  /**
   * @param {string} str A string to convert to camelCase
   * @returns {string} The camelCase version of the input string  
   */
  toCamelCase(str: string): string;

  /**
   * @description Converts all keys in an object or array from snake_case to camelCase.
   *   Recursively handles nested objects and arrays.
   *   Caches converted keys for performance.
   * @param {object|Array} obj An object that will have keys converted to camelCase
   * @returns {object|Array} An object with keys converted to camelCase
   */
  keysToCamelCase(obj: object): object;
}

/**
 * Namespace for text utilities.
 * @namespace text
 */ 
export const text: {
  /**
   * @description Splits text into lines to fit within a certain width, like a word processor would.
   *   Since calculations are expensive, results are memoized for fast lookup.
   *   This is useful when working with the Canvas API to render custom UI.
   * @param {CanvasRenderingContext2D} context The rendering context to measure text for.
   *   The context should have the font properties set before calling this function.
   * @param {string} baseText A single string that is perhaps too long and needs to be word-wrapped.
   *   Any existing line breaks (\n) will be preserved.
   *   Non-breaking spaces (\u00A0) will be respected.
   * @param {number} maxWidth The width in pixels that the text has to fit in.
   * @example let lines = text.canvasWordWrap(context, 'word wrap this long text', 200);
   * @returns {canvasWordWrapResult}
   */
  canvasWordWrap(context: CanvasRenderingContext2D, baseText: string, maxWidth: number): canvasWordWrapResult;

  /**
   * @description Clears the cached word wrap data. 
   */
  clearCanvasWordWrapCache(): void;

  useCamelCase(): useCamelCaseFactoryResult;
}

/**
 * Namespace for a collection of validators.
 * @namespace validation
 */
export const validation: {
  /**
   * @description Validates a domain.
   * @param {string} value The domain to validate.
   * @returns {ValidationResult} The result of the domain validation.
   */
  domain(value: string): ValidationResult;
  
  /**
   * @description Validates an email address.
   * @param {string} value The email address to validate.
   * @returns {ValidationResult} The result of the email validation.
   */
  email(value: string): ValidationResult;

  /**
   * @description Validates a phone number.
   * @param {string} [value] The phone number to validate.
   * @param {object} [options] optional options.
   * @param {boolean} [options.usOnly] True to validate with only US phone numbers.
   * @returns {ValidationResult} The result of the phone number validation.
   */
  phone(value: string, options?: object): ValidationResult;
}

/**
 * Represents the result of the canvasWordWrap function.
 */
export interface AreaCodeRecord {
  code: string;
  location: string;
  country: string;
}

/**
 * Namespace for phone number functions.
 * @namespace phone
 */
export const phone: {

  /**
   * @description gets information about a phone area code
   * @param {string} value A 3-digit area code or a complete phone number meeting the NPA standard
   * @returns { AreaCodeRecord | undefined }
   */
  getAreaCode(value: string): AreaCodeRecord | undefined
}
