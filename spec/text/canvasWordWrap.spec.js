import { text } from '../../src/text/_index.js'

const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod " +
  "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud " +
  "exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor " +
  "in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur " +
  "sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

const loremIpsumLineBreaks = "Lorem\nipsum\ndolor sit amet, consectetur adipiscing elit, sed do eiusmod " +
  "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud " +
  "exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor " +
  "in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur " +
  "sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."

describe('text.canvasWordWrap', () => {

  beforeEach(() => {
    text.clearCanvasWordWrapCache();
  });

  afterEach(() => {
    text.clearCanvasWordWrapCache();
  });

  it('should wrap long lines of text at 5px per character', () => {
     const result = text.canvasWordWrap(
      { 
        measureText: (str) => ({ width: str.length * 5 }),
        font: '5px Arial' // this string should not matter for the test
      },
      loremIpsum,
      200
    );
    expect(result.lines).toEqual([
      'Lorem ipsum dolor sit amet, consectetur',
      'adipiscing elit, sed do eiusmod tempor',
      'incididunt ut labore et dolore magna',
      'aliqua. Ut enim ad minim veniam, quis',
      'nostrud exercitation ullamco laboris',
      'nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit',
      'in voluptate velit esse cillum dolore eu',
      'fugiat nulla pariatur. Excepteur sint',
      'occaecat cupidatat non proident, sunt in',
      'culpa qui officia deserunt mollit anim',
      'id est laborum.'
    ]);
  })

  it('should wrap long lines of text at 10px per character', () => {
     const result = text.canvasWordWrap(
      { 
        measureText: (str) => ({ width: str.length * 10 }),
        font: '20px Arial' // this string should not matter for the test
      },
      loremIpsum,
      200
    );
    expect(result.lines).toEqual([
      'Lorem ipsum dolor',
      'sit amet,',
      'consectetur',
      'adipiscing elit, sed',
      'do eiusmod tempor',
      'incididunt ut labore',
      'et dolore magna',
      'aliqua. Ut enim ad',
      'minim veniam, quis',
      'nostrud exercitation',
      'ullamco laboris nisi',
      'ut aliquip ex ea',
      'commodo consequat.',
      'Duis aute irure',
      'dolor in',
      'reprehenderit in',
      'voluptate velit esse',
      'cillum dolore eu',
      'fugiat nulla',
      'pariatur. Excepteur',
      'sint occaecat',
      'cupidatat non',
      'proident, sunt in',
      'culpa qui officia',
      'deserunt mollit anim',
      'id est laborum.'
    ]);
  })

  it('should wrap long lines of text at 5px per character with line breaks', () => {
     const result = text.canvasWordWrap(
      { 
        measureText: (str) => ({ width: str.length * 5 }),
        font: '5px Arial'
      },
      loremIpsumLineBreaks,
      200
    );
    expect(result.lines).toEqual([
      'Lorem',
      'ipsum',
      'dolor sit amet, consectetur adipiscing',
      'elit, sed do eiusmod tempor incididunt',
      'ut labore et dolore magna aliqua. Ut',
      'enim ad minim veniam, quis nostrud',
      'exercitation ullamco laboris nisi ut',
      'aliquip ex ea commodo consequat. Duis',
      'aute irure dolor in reprehenderit in',
      'voluptate velit esse cillum dolore eu',
      'fugiat nulla pariatur. Excepteur sint',
      'occaecat cupidatat non proident, sunt in',
      'culpa qui officia deserunt mollit anim',
      'id est laborum.'
    ]);
  })

  it('should pull values from cache on the second time', () => {
    const context = { 
      measureText: (str) => ({ width: str.length * 5 }),
      font: '5px Arial'
    }

    const result = text.canvasWordWrap(
      context,
      loremIpsum,
      200
    );
    expect(result.lines).toEqual([
      'Lorem ipsum dolor sit amet, consectetur',
      'adipiscing elit, sed do eiusmod tempor',
      'incididunt ut labore et dolore magna',
      'aliqua. Ut enim ad minim veniam, quis',
      'nostrud exercitation ullamco laboris',
      'nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit',
      'in voluptate velit esse cillum dolore eu',
      'fugiat nulla pariatur. Excepteur sint',
      'occaecat cupidatat non proident, sunt in',
      'culpa qui officia deserunt mollit anim',
      'id est laborum.'
    ]);
    expect(result.fromCache).toBe(false)
    const result2 = text.canvasWordWrap(
      context,
      loremIpsum,
      200
    );
    expect(result2.lines).toEqual([
      'Lorem ipsum dolor sit amet, consectetur',
      'adipiscing elit, sed do eiusmod tempor',
      'incididunt ut labore et dolore magna',
      'aliqua. Ut enim ad minim veniam, quis',
      'nostrud exercitation ullamco laboris',
      'nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit',
      'in voluptate velit esse cillum dolore eu',
      'fugiat nulla pariatur. Excepteur sint',
      'occaecat cupidatat non proident, sunt in',
      'culpa qui officia deserunt mollit anim',
      'id est laborum.'
    ]);
    expect(result2.fromCache).toBe(true)
  })
})

describe('text.clearCanvasWordWrapCache', () => {
  it('should exist as a function', () => {
    expect(typeof text.clearCanvasWordWrapCache).toBe('function')
  })

  it('should clear the cache when called', () => {
    const context = { 
      measureText: (str) => ({ width: str.length * 5 }),
      font: '5px Arial'
    }

    const result = text.canvasWordWrap(
      context,
      loremIpsum,
      200
    );
    expect(result.fromCache).toBe(false)

    const result2 = text.canvasWordWrap(
      context,
      loremIpsum,
      200
    );
    expect(result2.fromCache).toBe(true)

    text.clearCanvasWordWrapCache()
    const result3 = text.canvasWordWrap(
      context,
      loremIpsum,
      200
    );
    expect(result3.fromCache).toBe(false)
  })
})