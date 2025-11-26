import { validation } from '../../src/validation/_index.js'

describe('validation.domain', () => {
  it('should accept null, undefined or empty string as a value', () => {
    let test
    test = validation.domain(undefined)
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.domain(null)
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.domain('')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
  })

  it('should reject local domains', () => {
    let test
    test = validation.domain('local')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidDomainLabelCount')
  })

  it('should reject domains under 3 characters', () => {
    let test
    test = validation.domain('lo')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidDomainLength')
  })

  it('should reject domains over 253 characters', () => {
    let test
    test = validation.domain('ehtfghcvbncoiernujhyrjdgjbljkr' +
      '.engblwerngbinergbvbnjgne.thhgjhgn.egthnetghnegthnegthn' +
      '.egghjkhfjmfhj.mfhgjmfghfmthn.egthnrgthnertyertygjhykg' +
      '.dyghjdtyjhjfghdfgssdfghrthn.rgiluwrtbpiu.nwriuthnpiuw' +
      '.rtlwrtbgijwnrgbnu9845nthn.egdfghsghnfghnf.ghnfghndghshhn.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidDomainLength')
  })

  it('should reject domains without a valid TLD', () => {
    let test
    test = validation.domain('mysite.comm')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidDomainTld')
    test = validation.domain('mysite.rrr')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidDomainTld')
  })

  it('should reject domains with bad hyphens', () => {
    let test
    test = validation.domain('mysite-.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidDomainLabelHyphen')
    test = validation.domain('-mysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidDomainLabelHyphen')
  })

  it('should reject domains with bad character', () => {
    let test
    test = validation.domain('my' + String.fromCodePoint(64) + 'site.com') // *
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidDomainCharacter')
    test = validation.domain('my' + String.fromCodePoint(91) + 'site.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidDomainCharacter')

    test = validation.domain('my' + String.fromCodePoint(96) + 'site.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidDomainCharacter')
    test = validation.domain('my' + String.fromCodePoint(123) + 'site.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidDomainCharacter')

    test = validation.domain('my' + String.fromCodePoint(47) + 'site.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidDomainCharacter')
    test = validation.domain('my' + String.fromCodePoint(58) + 'site.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidDomainCharacter')
  })

  it('should accept domains with allowed characters', () => {
    let test
    test = validation.domain('my' + String.fromCodePoint(48) + 'site.com')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.domain('my' + String.fromCodePoint(57) + 'site.com')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)

    test = validation.domain('my' + String.fromCodePoint(65) + 'site.com')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.domain('my' + String.fromCodePoint(90) + 'site.com')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)

    test = validation.domain('my' + String.fromCodePoint(97) + 'site.com')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.domain('my' + String.fromCodePoint(122) + 'site.com')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)

    test = validation.domain('my' + String.fromCodePoint(45) + 'site.com')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.domain('my' + String.fromCodePoint(128) + 'site.com')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
  })

  it('should reject domains with invalid label lengths', () => {
    let test
    test = validation.domain('mysite6789012345678901234567890123456789012345678901234567890123.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidDomainLabelLength')
  })

  it('should accept domains with a 63 character label lengths', () => {
    let test
    test = validation.domain('mysite678901234567890123456789012345678901234567890123456789012.com')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
  })
})