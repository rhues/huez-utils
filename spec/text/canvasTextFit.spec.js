import { text } from '../../src/text/_index.js'
import { createMockCanvasContext } from '../helpers/mockCanvasContext.js'

describe('text.canvasTextFit', () => {

  describe('fitText', () => {

    it('should run with reasonable inputs', () => {
      const { context, fontUpdates } = createMockCanvasContext({ font: '20px Arial' });

      const result = text.fitText(
        context,
        'This is some sample text to fit inside a rectangle.',  
        500,
        200,
        { lineHeightPx: 1.2 }
      );

      // verify returned values for the fit
      expect(result.fontSize).toEqual(38.183)
      expect(result.font).toEqual('38.183px Arial')      
      expect(result.lines).toEqual([
        'This is some', 'sample text', 'to fit inside', 'a rectangle.'
      ])
      expect(result.lineHeightPx).toBeCloseTo(47.72875, 3)

      // these values should match the requested rectangle
      expect(result.width).toEqual(500)
      expect(result.height).toEqual(200)

      // ensure that fitting took multiple steps
      expect(result.steps).toBeGreaterThan(1)

      // can't know the exaict time, but at least ensure it's a number
      expect(typeof result.timeMs).toEqual('number')

      // The algorithm should have adjusted the font size 3 times
      expect(fontUpdates?.length).toBeGreaterThanOrEqual(3)

      // ensure context font is restored
      expect(context.font).toEqual('20px Arial')
    })

    it('should fall back when context font lacks size info', () => {
      const { context, fontUpdates } = createMockCanvasContext({ initialFont: 'Arial' });

      const result = text.fitText(
        context,
        'Fallback font template ensures coverage.',
        300,
        150
      );

      expect(fontUpdates.length).toBeGreaterThan(0);
      expect(fontUpdates.every(value => /px sans-serif$/.test(value))).toBeTrue();
      expect(result.font).toMatch(/px sans-serif$/);
    })

    it('should fall back when context font uses unsupported units', () => {
      const { context, fontUpdates } = createMockCanvasContext({ initialFont: 'italic 18abc Fancy' });

      const result = text.fitText(
        context,
        'Unsupported units trigger fallback.',
        280,
        160
      );

      expect(fontUpdates.length).toBeGreaterThan(0);
      expect(fontUpdates.every(value => /px sans-serif$/.test(value))).toBeTrue();
      expect(result.font).toMatch(/px sans-serif$/);
    })

    it('should fall back when font size is not finite', () => {
      const { context, fontUpdates } = createMockCanvasContext({ initialFont: 'NaNpx Arial' });

      const result = text.fitText(
        context,
        'Non finite font size fallback.',
        220,
        160
      );

      expect(fontUpdates.length).toBeGreaterThan(0);
      expect(result.font).toMatch(/px sans-serif$/);
      expect(context.font).toBe('NaNpx Arial');
    })

    it('should trim preserved whitespace and convert varied font units', () => {
      const sampleText = '   spaced   words  \n  next line   ';
      const fonts = [
        { initialFont: '', matcher: /px sans-serif$/ },
        { initialFont: 'italic bold 24pt Fancy', matcher: /italic bold .*px Fancy$/ },
        { initialFont: 'oblique 18pc Fancy', matcher: /oblique .*px Fancy$/ },
        { initialFont: 'lighter 12in Fancy', matcher: /lighter .*px Fancy$/ },
        { initialFont: '300 8cm Fancy', matcher: /300 .*px Fancy$/ },
        { initialFont: 'bold 6mm Fancy', matcher: /bold .*px Fancy$/ },
        { initialFont: 'normal 40q Fancy', matcher: /normal .*px Fancy$/ },
        { initialFont: 'normal 2em Fancy', matcher: /normal .*px Fancy$/ },
        { initialFont: 'normal 3rem Fancy', matcher: /normal .*px Fancy$/ }
      ];

      fonts.forEach(({ initialFont, matcher }) => {
        const { context, fontUpdates } = createMockCanvasContext({ initialFont });
        const result = text.fitText(
          context,
          sampleText,
          220,
          160,
          {
            preserveMultipleSpaces: true,
            removeLeadingSpaces: true,
            removeTrailingSpaces: true,
            hyphenate: false,
            breakLongWords: false,
            minFontSize: 8,
            maxFontSize: 24
          }
        );

        expect(result.lines.length).toBeGreaterThanOrEqual(2);
        expect(result.lines.every(line => !line.startsWith(' '))).toBeTrue();
        expect(result.lines.every(line => !line.endsWith(' '))).toBeTrue();
        expect(fontUpdates.length).toBeGreaterThan(0);
        expect(result.font).toMatch(matcher);
        expect(context.font).toBe(initialFont || '');
      });
    })

    it('should keep leading and trailing spaces when trimming is disabled', () => {
      const { context } = createMockCanvasContext({ initialFont: '18px Arial' });
      const result = text.fitText(
        context,
        '   lead  \n\ntrail   ',
        400,
        200,
        {
          preserveMultipleSpaces: true,
          removeLeadingSpaces: false,
          removeTrailingSpaces: false,
          hyphenate: false,
          breakLongWords: false,
          minFontSize: 18,
          maxFontSize: 18
        }
      );

      expect(result.lines.length).toBeGreaterThanOrEqual(3);
      expect(result.lines[0].startsWith('   ')).toBeTrue();
      expect(result.lines[0].endsWith('  ')).toBeTrue();
      expect(result.lines).toContain('');
      expect(result.lines[result.lines.length - 1].endsWith('   ')).toBeTrue();
      expect(context.font).toBe('18px Arial');
    })

    it('should hyphenate long words that exceed remaining width', () => {
      const { context } = createMockCanvasContext({ initialFont: '20px Arial' });
      const result = text.fitText(
        context,
        'AAAA SUPERLONGWORDSHOULDBEBROKEN',
        100,
        120,
        {
          hyphenate: true,
          breakLongWords: true,
          minFontSize: 20,
          maxFontSize: 20,
          epsilon: 5
        }
      );

      expect(result.lines.length).toBeGreaterThan(1);
      expect(result.lines.some(line => line.includes('–'))).toBeTrue();
      const combined = result.lines.join('').replace(/–/g, '');
      expect(combined.includes('SUPERLONGWORDSHOULDBEBROKEN')).toBeTrue();
      expect(context.font).toBe('20px Arial');
    })

    it('should break long words without hyphen when hyphenation disabled', () => {
      const { context } = createMockCanvasContext({ initialFont: '20px Arial' });
      const result = text.fitText(
        context,
        'AAAA SUPERLONGWORDSHOULDBEBROKEN',
        100,
        120,
        {
          hyphenate: false,
          breakLongWords: true,
          minFontSize: 20,
          maxFontSize: 20,
          epsilon: 5
        }
      );

      expect(result.lines.length).toBeGreaterThan(1);
      expect(result.lines.every(line => !line.includes('–'))).toBeTrue();
      expect(context.font).toBe('20px Arial');
    })

    it('should treat missing space measurements as zero width', () => {
      let fontValue = '20px Arial';
      let textAlign = 'left';
      let fontSetCount = 0;
      const savedStates = [];
      let spaceUndefinedMeasured = false;

      const context = {
        get font() { return fontValue; },
        set font(value) { fontSetCount++; fontValue = value; },
        get textAlign() { return textAlign; },
        set textAlign(value) { textAlign = value; },
        measureText(str) {
          const size = Number.parseFloat(fontValue) || 0;
          if (str === ' ' && fontSetCount >= 2) {
            spaceUndefinedMeasured = true;
            return {};
          }
          return { width: size * str.length };
        },
        fillText() {},
        strokeText() {},
        save() { savedStates.push({ font: fontValue, textAlign }); },
        restore() {
          const state = savedStates.pop();
          if (state) {
            fontValue = state.font;
            textAlign = state.textAlign;
          }
        }
      };

      const result = text.fitText(
        context,
        'space fallback check',
        200,
        80,
        { breakLongWords: false }
      );

      expect(result.lines).toEqual(['space', 'fallback', 'check']);
      expect(spaceUndefinedMeasured).toBeTrue();
      expect(context.font).toBe('20px Arial');
    })

    it('should clamp final size to minimum when best size is non-positive', () => {
      const { context } = createMockCanvasContext({ initialFont: '14px Arial' });
      const result = text.fitText(
        context,
        'tiny',
        1,
        1,
        {
          minFontSize: 0,
          maxFontSize: 0,
          breakLongWords: false,
          lineHeight: 1,
          precision: 0.1
        }
      );

      expect(result.fontSize).toEqual(0);
      expect(result.font).toEqual('0px Arial');
      expect(result.lines).toEqual(['tiny']);
      expect(context.font).toBe('14px Arial');
    })

    it('should default maxFontSize when height is too small', () => {
      const { context, fontUpdates } = createMockCanvasContext({ initialFont: '16px Arial' });
      const result = text.fitText(
        context,
        'max fallback',
        100,
        0
      );

      expect(fontUpdates[0]).toEqual('63px Arial');
      expect(result.fontSize).toBeGreaterThan(0);
      expect(context.font).toBe('16px Arial');
    })

  })

  describe('drawText', () => {
    
    function typicalFitResult(params = {}) {
      return {
        font: params.font ?? '30px Arial',
        fontSize: params.fontSize ?? 30,
        lines: params.lines ?? ['This is some', 'sample text', 'to fit inside', 'a rectangle.'],
        lineHeightPx: params.lineHeightPx ?? 36,
        width: params.width ?? 400,
        height: params.height ?? 200
      };
    }

    it('should run with reasonable inputs', () => {
      const { context } = createMockCanvasContext();
      
      text.drawText(
        context,
        typicalFitResult(),
        0,
        0,
        'fillText',
        'top'
      );

      text.drawText(
        context,
        typicalFitResult(),
        0,
        0,
        'fillText',
        'middle'
      );

      text.drawText(
        context,
        typicalFitResult(),
        0,
        0,
        'strokeText',
        'bottom'
      );

      text.drawText(
        context,
        typicalFitResult(),
        0,
        0
      );

      text.drawText(
        context,
        typicalFitResult(),
      );
    })

    it('should work with context.textAlign == right or center', () => {
      let context = createMockCanvasContext({ textAlign: 'center'}).context;
      text.drawText(
        context,
        typicalFitResult(),
        0,
        0,
        'fillText',
        'top'
      );
      let context2 = createMockCanvasContext({ textAlign: 'right'}).context

      text.drawText(
        context2,
        typicalFitResult(),
        0,
        0,
        'fillText',
        'top'
      );
    })

    it('should throw an exception if command value is invalid', () => {
      const { context } = createMockCanvasContext();
      
      expect(() => {
        text.drawText(
          context,
          typicalFitResult(),
          0,
          0,
          'invalidCommand',
          'top'
        );
      }).toThrowError();
    })

    it('should throw an exception if verticalAlign value is invalid', () => {
      const { context } = createMockCanvasContext();
      expect(() => {
        text.drawText(
          context,
          typicalFitResult(),
          0,
          0,
          'strokeText',
          'invalid'
        );
      }).toThrowError();
    })

    it('should throw an exception if no fitResult lines', () => {
      const { context } = createMockCanvasContext();
      expect(() => {
        text.drawText(
          context,
          typicalFitResult({ lines: [] }),
          0,
          0
        );
      }).toThrowError();
    })

    it('should throw an exception if no valid lineHeightPx', () => {
      const { context } = createMockCanvasContext();
      expect(() => {
        text.drawText(
          context,
          typicalFitResult({ lineHeightPx: 0 }),
          0,
          0
        );
      }).toThrowError();
    })

    it('should throw an exception if no valid font', () => {
      const { context } = createMockCanvasContext();
      expect(() => {
        text.drawText(
          context,
          typicalFitResult({ font: ''}),
          0,
          0
        );
      }).toThrowError();
    })

    it('should throw an exception if no valid fontSize', () => {
      const { context } = createMockCanvasContext();
      expect(() => {
        text.drawText(
          context,
          typicalFitResult({ fontSize: 0 }),
          0,
          0
        );
      }).toThrowError();
    })

    it('should throw an exception if context is the wrong type (no  save or restore)', () => {
      expect(() => {
        text.drawText(
          {},
          typicalFitResult(),
          0,
          0
        );
      }).toThrowError();
    })

    it('should throw an exception if x or y is invalid', () => {
      const { context } = createMockCanvasContext();
      expect(() => {
        text.drawText(
          context,
          typicalFitResult(),
          'sfgh',
          0
        );
      }).toThrowError();
      expect(() => {
        text.drawText(
          context,
          typicalFitResult(),
          0,
          'sfgh'
        );
      }).toThrowError();
    })

  })
})