/** @module validation */

/**
 * @typedef {Object} ValidationNamespace
 * @property domain
 * @property email
 * @property phone
 */

/**
 * @typedef {Object} ValidationError
 * @property {string} [code] The error code.
 * @property {string} [message] The validation message.
 */

/**
 * @description The result of a validation operation.
 * @typedef {Object} ValidationResult
 * @property {boolean} valid Whether the input is valid.
 * @property {Array<ValidationError>} errors Optional validation message.
 */

import { domain } from './domain.js'
import { email } from './email.js'
import { phone } from './phone.js'

/** @type {ValidationNamespace} */
export const validation = {
  domain,
  email,
  phone
}
