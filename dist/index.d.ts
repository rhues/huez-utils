export interface MainNamespace {
  /** Namespace for text utilities.
   * @namespace text
   */
  text: typeof text;

  /** Namespace for a collection of validators.
   * @namespace validation
   */
  validation: typeof validation;
} 

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

export interface AreaCodeRecord {
  code: string;
  location: string;
  country: string;
}

/**
 * Namespace for phone related functions
 * @namespace phone
 */
export const phone: {
  /**
   * @description gets an area code record
   * @param {string} code A 3-digit area code
   * @returns {AreaCodeRecord} Information about an area code
   */
  getAreaCode(code: string): AreaCodeRecord;
}