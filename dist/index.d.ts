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
  /** @description An optional error code. */
  code?: string;
  /** @description An optional error message in English. */
  message?: string;
}

/**
 * Represents the result of a validation operation, shared across all validators.
 */
export interface ValidationResult {
  /** @description True if the input is valid, false otherwise. */
  valid: boolean;
  /** @description An array of validation errors, if any. */
  errors: ValidationError[];
}

/**
 * Represents the result of the canvasWordWrap function.
 */
export interface WrapResult {
  /** @description lines of text that have been wrapped. */
  lines: string[];
}

export interface UseCanvasWordWrapResult {
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
   * @example let lines = text.useCanvasWordWrap().wrap(context, 'word wrap this long text', 200);
   * @returns {WrapResult}
   */
  wrap(context: CanvasRenderingContext2D, baseText: string, maxWidth: number): WrapResult;
}

export interface UseCamelCaseResult {
  /** @description Converts a string to camelCase.
   * Example: 'hello_world' => 'helloWorld'
   */
  toCamelCase(input: string): string;

  /**
   * @description Converts all keys in an object or array to camelCase.
   * Handles nested objects and arrays.
   */
  keysToCamelCase(obj: object): object;
}

export interface CanvasTextFitResult {
  /** 
   * @description An object returned from fitText that contains essential info to draw fitted text
   */
  fontSize: number;
  /** @description Font string applied to the canvas context when text was measured. */
  font: string;
  /** @description Wrapped lines that fit within the configured rectangle. */
  lines: string[];
  /** @description Line height in pixels used when rendering the lines. */
  lineHeightPx: number;
  /** @description Target rectangle width in pixels. */
  width: number;
  /** @description Target rectangle height in pixels. */
  height: number;
  /** @description Number of iterations taken during the fitting binary search. */
  steps: number;
  /** @description Duration of the fit operation in milliseconds. */
  timeMs: number;
}

export interface CanvasTextFitOptions {
  /** @description Line height multiplier. Default 1.25. */
  lineHeight?: number;
  /** @description Minimum font size in pixels. Default 6. */
  minFontSize?: number;
  /** @description Maximum font size in pixels. Default Math.floor(height / lineHeight) || 120. */
  maxFontSize?: number;
  /** @description Hyphen character to use when breaking words. Default en dash. */
  hyphen?: string;
  /** @description Toggle hyphenation when breaking long words. Default true. */
  hyphenate?: boolean;
  /** @description Toggle breaking words that exceed the line width. Default true. */
  breakLongWords?: boolean;
  /** @description Preserve consecutive spaces instead of collapsing them. Default false. */
  preserveMultipleSpaces?: boolean;
  /** @description Remove leading spaces from wrapped lines. Default true. */
  removeLeadingSpaces?: boolean;
  /** @description Remove trailing spaces from wrapped lines. Default true. */
  removeTrailingSpaces?: boolean;
  /** @description Fractional precision target for the binary search. Default 0.01. */
  precision?: number;
  /** @description Tolerance used when comparing widths and heights. Default 1e-3. */
  epsilon?: number;
}

/**
 * Namespace for text utilities.
 * @namespace text
 */ 
export const text: {
  /**
   * @description Factory function that provides a method to word-wrap text for Canvas rendering.
   *   Since calculations are expensive, results are memoized for fast lookup.
   *   This is useful when working with the Canvas API to render custom UI.
   */
  useCanvasWordWrap(): UseCanvasWordWrapResult;
  
  /**
   * @description Factory function that provides methods to convert strings to camelCase
   *   and to convert all keys in an object or array to camelCase.
   */
  useCamelCase(): UseCamelCaseResult;

  /**
   * @description Fits text within a rectangle by adjusting font size and wrapping.
   *   Returns information required to render the fitted text later.
   *   Options fall back to the documented defaults when omitted.
   */
  fitText(
    context: CanvasRenderingContext2D,
    text: string,
    width: number,
    height: number,
    options?: CanvasTextFitOptions
  ): CanvasTextFitResult;

  /**
   * @description Draws previously fitted text on a canvas using the metrics from fitText.
   *   Defaults: x 0, y 0, command 'fillText', verticalAlign 'top'.
   */
  drawText(
    context: CanvasRenderingContext2D,
    fitResult: CanvasTextFitResult,
    x?: number,
    y?: number,
    command?: 'fillText' | 'strokeText',
    verticalAlign?: 'top' | 'middle' | 'bottom'
  ): void;
}

/**
 * Namespace for a collection of validators.
 * @namespace validation
 */
export const validation: {
  /**
   * @description Validates whether a string is a valid domain name.
   * @param {string} value The domain to validate.
   * @returns {ValidationResult} The result of the domain validation.
   */
  domain(value: string): ValidationResult;
  
  /**
   * @description Validates whether a string is a valid email address.
   * @param {string} value The email address to validate.
   * @returns {ValidationResult} The result of the email validation.
   */
  email(value: string): ValidationResult;

  /**
   * @description Validates whether a string is a valid phone number.
   * @param {string} [value] The phone number to validate.
   * @param {object} [options] optional options.
   * @param {boolean} [options.usOnly] True to validate with only US phone numbers.
   * @returns {ValidationResult} The result of the phone number validation.
   */
  phone(value: string, options?: object): ValidationResult;
}

export interface AreaCodeRecord {
  /** @description The 3-digit area code as a string. */
  code: string;
  /** @description State, province or non-geographic description */
  location: string;
  /** @description two-letter code of the country */
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

  /**
 * @description formats an NPA phone number
 * @memberof phone
 * @param {string} value A phone number meeting the NPA standard
 * @returns { string | undefined }
 */
  formatNpa(value: string): string | undefined;
}