import { validation } from '../../src/validation/_index.js'

const usOnlyOption = { usOnly: true }

describe('validation.phone', () => {
  it('should accept null, undefined or empty string as a value', () => {
    let test
    test = validation.phone(undefined)
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.phone(null)
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.phone('')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
  })
  it('should accept 8 to 15 digits', () => {
    let test
    test = validation.phone('12345678')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.phone('123456789012345')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
  })
  it('should reject a phone number that is less than 8 digits or more than 15', () => {
    let test
    test = validation.phone('1234567')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidPhoneLength')
    test = validation.phone('1234567890123456')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidPhoneLength')
  })
  it('should accept a number with any kind of non-digit characters', () => {
    let test
    test = validation.phone('(916) 555-1212')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.phone('+1 (916) 555-1212')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.phone('1.916.555.1212')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
  })
  it('should accept international phone numbers with country code', () => {
    let test
    test = validation.phone('+44 207 946 0958') // UK
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.phone('+91 987 6543 2100') // India
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.phone('+81 03 12345678') // Japan
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
  })
})

describe('validation.phone with usOnly option', () => {
  it('should accept null, undefined or empty string as a value', () => {
    let test
    test = validation.phone(undefined, usOnlyOption)
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.phone(null, usOnlyOption)
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.phone('', usOnlyOption)
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
  })
  it('should accept 10 digits or 11 if the first digit is 1', () => {
    let test
    test = validation.phone('9164567890', usOnlyOption)
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.phone('19164567890', usOnlyOption)
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
  })
  it('should reject a phone number that is not 10 digits without country code', () => {
    let test
    test = validation.phone('916456789', usOnlyOption)
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidUsPhoneLength')
    test = validation.phone('91645678901', usOnlyOption)
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidUsPhoneCountryCode')
  })
  it('should reject a phone number that is not 11 digits with country code', () => {
    let test
    test = validation.phone('1916456789', usOnlyOption)
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidUsPhoneAreaCode')
    test = validation.phone('191645678901', usOnlyOption)
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidUsPhoneLength')
  })
  it('should accept a number with any kind of non-digit characters', () => {
    let test
    test = validation.phone('(916) 555-1212', usOnlyOption)
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.phone('+1 (916) 555-1212', usOnlyOption)
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.phone('1.916.555.1212', usOnlyOption)
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
  })
  it('should reject international phone numbers with country code', () => {
    let test
    test = validation.phone('+44 207 946 0958', usOnlyOption) // UK
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidUsPhoneLength')
    test = validation.phone('+91 987 6543 2100', usOnlyOption) // India
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidUsPhoneLength')
    test = validation.phone('+81 03 12345678', usOnlyOption) // Japan
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidUsPhoneLength')
  })
  it('should reject bad US area codes', () => {
    let test
    test = validation.phone('5556667777', usOnlyOption)
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidUsPhoneAreaCode')
    test = validation.phone('15556667777', usOnlyOption)
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidUsPhoneAreaCode')
  })
})