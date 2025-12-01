import { phone } from '../../src/phone/_index.js'

describe('phone.getAreaCode', () => {
  it('should return a record for a valid area code', () => {
    expect(phone.getAreaCode('916')).toEqual({ code: '916', location: 'CA', country: 'US' })
  })

  it('should return undefined for an invalid area code', () => {
    expect(phone.getAreaCode('275')).toBe(undefined)
  })
})