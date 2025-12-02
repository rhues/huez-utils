/** @module phone/formatNpa */

/**
 * @description formats an NPA phone number
 * @memberof phone
 * @param {string} value A phone number meeting the NPA standard
 * @returns { string | undefined }
 */
function formatNpa(value) {
  if (!value) {
    return
  }

  // strip out non-digit characters
  const digits = value.replace(/\D/g, '')

  if (digits.length === 10) {
    return `(${digits.substring(0, 3)}) ${digits.substring(3, 6)}-${digits.substring(6, 10)}`
  } else if (digits.length === 11) {
    return `(${digits.substring(1, 4)}) ${digits.substring(4, 7)}-${digits.substring(7, 11)}`
  }
}

export { formatNpa }