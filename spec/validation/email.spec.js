import { validation } from '../../src/validation/_index.js'

describe('validation.email', () => {
  it('should accept null, undefined or empty string as a value', () => {
    let test
    test = validation.email(undefined)
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.email(null)
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.email('')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
  })

  it('should reject emails with @ issues', () => {
    let test
    test = validation.email('memysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidEmailFormat')
    test = validation.email('hi@me@mysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidEmailFormat')
  })

  it('should accept emails with a valid domain', () => {
    let test
    test = validation.email('me@mysite.com')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
  })

  it('should reject emails with a bad domain', () => {
    let test
    test = validation.email('me@my*site.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidDomainCharacter')

    test = validation.email('me@mysite.comm')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidDomainTld')
  })

  it('should reject emails with a local part greater than 64 characters', () => {
    let test
    test = validation.email('liufsgfblisgflijslfjgbnsljfkgnblkjsfngblikjsnfglbnslfkgbnlkjsfgnb@mysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidEmailLocalPartLength')
  })

  it('should reject emails with a local part that starts with a dot', () => {
    let test
    test = validation.email('.me@mysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidEmailDot')
  })

  it('should reject emails with a local part that contains a double dot', () => {
    let test
    test = validation.email('me..mine@mysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidEmailDot')
  })

  it('should accept emails with single dots not at the beginning', () => {
    let test
    test = validation.email('first.last@mysite.com')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.email('first.last.@mysite.com')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
    test = validation.email('first.middle.last@mysite.com')
    expect(test.valid).toBe(true)
    expect(test.errors.length).toBe(0)
  })

  it('should reject emails with a local part of postmaster', () => {
    let test
    test = validation.email('postmaster@mysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidEmailNoPostmaster')
    test = validation.email('PostMaster@mysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidEmailNoPostmaster')
  })

  it('should reject emails with a local part bad character', () => {
    let test
    test = validation.email('m\"e@mysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidEmailCharacter')
    test = validation.email('m e@mysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidEmailCharacter')
    test = validation.email('m,e@mysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidEmailCharacter')
    test = validation.email('m:e@mysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidEmailCharacter')
    test = validation.email('m;e@mysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidEmailCharacter')
    test = validation.email('m<e@mysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidEmailCharacter')
    test = validation.email('m>e@mysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidEmailCharacter')
    test = validation.email('m[e@mysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidEmailCharacter')
    test = validation.email('m]e@mysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidEmailCharacter')
    test = validation.email('m(e@mysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidEmailCharacter')
    test = validation.email('m)e@mysite.com')
    expect(test.valid).toBe(false)
    expect(test.errors[0].code).toBe('invalidEmailCharacter')
  })
})