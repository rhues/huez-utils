import { phone } from '../../src/phone/_index.js'

describe('phone.getAreaCode', () => {
  it('should return a record for a valid area code', () => {
    expect(phone.getAreaCode('916')).toEqual({ code: '916', location: 'CA', country: 'US' })
  })

  it('should return undefined for an invalid area code', () => {
    expect(phone.getAreaCode('275')).toBe(undefined)
  })

  it('should return undefined for a blank value', () => {
    expect(phone.getAreaCode(undefined)).toBe(undefined)
    expect(phone.getAreaCode(null)).toBe(undefined)
    expect(phone.getAreaCode('')).toBe(undefined)
  })

  it('should return a record for a valid phone number with a valid 10-digit number', () => {
    expect(phone.getAreaCode('9163214321')).toEqual({ code: '916', location: 'CA', country: 'US' })
    expect(phone.getAreaCode('916.321.4321')).toEqual({ code: '916', location: 'CA', country: 'US' })
    expect(phone.getAreaCode('(916) 321-4321')).toEqual({ code: '916', location: 'CA', country: 'US' })
  })

  it('should return a record for a valid phone number with a valid 11-digit number', () => {
    expect(phone.getAreaCode('19163214321')).toEqual({ code: '916', location: 'CA', country: 'US' })
    expect(phone.getAreaCode('+19163214321')).toEqual({ code: '916', location: 'CA', country: 'US' })
    expect(phone.getAreaCode('+1 (916) 321-4321')).toEqual({ code: '916', location: 'CA', country: 'US' })
    expect(phone.getAreaCode('1 916.321.4321')).toEqual({ code: '916', location: 'CA', country: 'US' })
  })
})