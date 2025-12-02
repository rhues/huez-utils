import { phone } from '../../src/phone/_index.js'

describe('phone.formatNpa', () => {
  it('should return a formatted NPA phone number given a valid 10-digit number', () => {
    expect(phone.formatNpa('9164325432')).toEqual('(916) 432-5432')
    expect(phone.formatNpa('916.432.5432')).toEqual('(916) 432-5432')
    expect(phone.formatNpa('(916) 432-5432')).toEqual('(916) 432-5432')
  })

  it('should return a formatted NPA phone number given a valid 11-digit number', () => {
    expect(phone.formatNpa('19164325432')).toEqual('(916) 432-5432')
    expect(phone.formatNpa('1.916.432.5432')).toEqual('(916) 432-5432')
    expect(phone.formatNpa('+1 (916) 432-5432')).toEqual('(916) 432-5432')
  })

  it('should return undefined for an invalid number', () => {
    expect(phone.formatNpa('191643254322')).toEqual(undefined)
    expect(phone.formatNpa('916432543')).toEqual(undefined)
    expect(phone.formatNpa(undefined)).toEqual(undefined)
    expect(phone.formatNpa(null)).toEqual(undefined)
    expect(phone.formatNpa('')).toEqual(undefined)
  })
})