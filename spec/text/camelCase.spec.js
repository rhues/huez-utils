import { text } from '../../src/text/_index.js'

describe('text.useCamelCase', () => {

  describe('toCamelCase', () => {
    it('should convert snake_case to camelCase', () => {
      const camelCase = text.useCamelCase()
      expect(camelCase.toCamelCase('hello_world')).toBe('helloWorld')
      expect(camelCase.toCamelCase('this_is_a_test')).toBe('thisIsATest')
      expect(camelCase.toCamelCase('_leading_underscore')).toBe('leadingUnderscore')
      expect(camelCase.toCamelCase('trailing_underscore_')).toBe('trailingUnderscore')
      expect(camelCase.toCamelCase('multiple__underscores')).toBe('multipleUnderscores')
    })
  }),

  describe('keysToCamelCase', () => {
    it('should convert object keys to camelCase', () => {
      const camelCase = text.useCamelCase()
      const input = {
        test_key: 'value',
        nested_object: {
          another_key: 123
        },
        _yu: [
          {
            i_d:1
          },
          {
            i_d:2
          }
        ]
      }
      const expected = {
        testKey: 'value',
        nestedObject: {
          anotherKey: 123
        },    
        yu: [
          {
            iD:1
          },
          {
            iD:2
          }
        ]
      }
      expect(camelCase.keysToCamelCase(input)).toEqual(expected)
    })
  })

})
