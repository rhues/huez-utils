/**
 * @module text/canvasTextFit 
 * @description Utilities to fit and draw text inside a rectangle on a canvas.
 *   Why two methods? After performing a text fit, clients may want to draw the text
 *   multiple times with different styles (fill, stroke, colors, shadows, etc).
 *   Separating fitting from drawing allows this flexibility without re-fitting each time.
 *   Clients may want to wait for document.fonts.ready before calling any
 *   of these functions, the the fonts may not be available.
 */

 /* TODO: hyphenization is naive and can be improved */

 /**
  * @typedef {Object} CanvasTextFitResult
  * @property {number} fontSize Calculated font size in pixels.
  * @property {string} font Font string applied to the canvas context.
  * @property {string[]} lines Wrapped lines that fit within the rectangle.
  * @property {number} lineHeightPx Line height in pixels used to render the lines.
  * @property {number} width Target rectangle width in pixels.
  * @property {number} height Target rectangle height in pixels.
  * @property {number} steps Number of binary search iterations taken.
  * @property {number} timeMs Duration of the fit operation in milliseconds.
  */

 /**
  * @typedef {Object} CanvasTextFitOptions
  * @property {number} [lineHeight=1.25] Line height multiplier.
  * @property {number} [minFontSize=6] Minimum font size in pixels.
  * @property {number} [maxFontSize=Math.floor(height / lineHeight) || 120] Maximum font size in pixels. 
  * @property {string} [hyphen='–'] Hyphen character to use when breaking words.
  * @property {boolean} [hyphenate=true] Whether to hyphenate long words when breaking.
  * @property {boolean} [breakLongWords=true] Whether to break long words that exceed line width.
  * @property {boolean} [preserveMultipleSpaces=false] Whether to preserve multiple spaces in the input text.
  * @property {boolean} [removeLeadingSpaces=true] Whether to remove leading spaces from lines.
  * @property {boolean} [removeTrailingSpaces=true] Whether to remove trailing spaces from lines.
  * @property {number} [precision=0.01] Fractional precision target for the binary search (e.g. 0.01 ≈ 1%).
  * @property {number} [epsilon=1e-3] Tolerance used when comparing widths and heights.
  */

 /**
  * @description Fit the given text inside the specified rectangle by adjusting font size and wrapping.
  * @param {CanvasRenderingContext2D} context Canvas context to use for text measurement.
  * Set the context.font property before calling to provide the base font style.
  * @param {string} text The text to fit inside the rectangle.
  * @param {number} width Width of the rectangle in pixels. 
  * @param {number} height Height of the rectangle in pixels. 
  * @param {CanvasTextFitOptions} options Options object to control fitting behavior.
  * @returns {CanvasTextFitResult} A result object containing information 
  * necessary to render the fitted text. This result should be passed to drawText().
  */
  function fitText(context, text, width, height, options = {}) {
    const startTime = performance.now();
    const {
      lineHeight = 1.25,
      minFontSize = 6,
      maxFontSize = Math.floor(height / lineHeight) || 120,
      hyphen = '–',
      hyphenate = true,
      breakLongWords = true,
      preserveMultipleSpaces = false,
      removeLeadingSpaces = true,
      removeTrailingSpaces = true,      
      precision = .01,                  // binary search stops when precision is reached.
                                        // Smaller means more steps but more accurate.
      epsilon = 1e-3                    // tolerance for fitting calculations
    } = options;
    context.save();

    const fontTemplate = createFontTemplate(context.font);
    const tokens = tokenize(text, { preserveMultipleSpaces });

    // Distinct texts to measure
    const distinctTexts = new Set(tokens.filter(t => t.type !== 'break').map(t => t.text));
    distinctTexts.add(' ');
    if (hyphenate) distinctTexts.add(hyphen);

    // Measure text at baseline size
    const baselineFontSize = Math.max(10, Math.floor((minFontSize + maxFontSize) / 2));
    setFont(context, baselineFontSize, fontTemplate);
    const baselineWidthMap = new Map();
    for (const t of distinctTexts) {
      baselineWidthMap.set(t, context.measureText(t).width);
    }
    baselineWidthMap.set(' ', context.measureText(' ').width);
    const scaledWidth = (size, text) => (baselineWidthMap.get(text)
      ?? context.measureText(text).width) * (size / baselineFontSize);

    // Binary search using scaled widths
    let lo = Math.min(minFontSize, maxFontSize);
    let hi = Math.max(minFontSize, maxFontSize);
    let mid = (lo + hi) / 2;
    let bestSize = lo;
    let steps = 0;
    let wrapResult;

    while (((hi - lo) / mid) > precision && steps < 10) {
      steps++;
      wrapResult = wrapTokens({
        rectWidth: width,
        tokens,
        measureText: (str) => scaledWidth(mid, str),
        hyphen,
        hyphenate,
        breakLongWords,
        removeLeadingSpaces,
        removeTrailingSpaces,
        epsilon
      });

      const totalHeight = wrapResult.lines.length * (mid * lineHeight);
      if (totalHeight <= height + epsilon) {
        bestSize = mid;
        lo = mid;
      } else {
        hi = mid;
      }
      mid = (lo + hi) / 2;
    }

    const finalSize = round3(bestSize > 0 ? bestSize : Math.max(minFontSize, bestSize - precision));
    setFont(context, finalSize, fontTemplate);

    // final measurement at finalSize (for rendering consistency)
    const finalWidthMap = new Map();
    for (const t of distinctTexts) finalWidthMap.set(t, context.measureText(t).width);
    const measureFinal = (str) => finalWidthMap.get(str) ?? context.measureText(str).width;
    const finalWrap = wrapTokens({
      rectWidth: width,
      tokens,
      measureText: measureFinal,
      hyphen,
      hyphenate,
      breakLongWords,
      removeLeadingSpaces,
      removeTrailingSpaces,
      epsilon
    });

    setFont(context, round3(finalSize), fontTemplate);
    const fontUsed = context.font;
    context.restore();
    return {
      fontSize: finalSize,
      font: fontUsed,
      lines: finalWrap.lines,
      lineHeightPx: finalSize * lineHeight,
      width: width,
      height: height,
      steps,
      timeMs: performance.now() - startTime
    };
  }

  /**
   * Draw the fitted text inside the given rectangle. Configure context fill, stroke, and textAlign
   * properties before calling this function to control rendering style.
   * @param {CanvasRenderingContext2D} context Canvas context with desired paint settings applied.
   * @param {CanvasTextFitResult} fitResult Result object from fit().
   * @param {number} [x=0] Distance from the left of the rectangle in pixels.
   * @param {number} [y=0] Distance from the top of the rectangle in pixels. 
   * @param {'fillText'|'strokeText'} [command='fillText'] How to draw the text.
   * @param {'top'|'middle'|'bottom'} [verticalAlign='top'] Vertical placement of the text block.
   * @returns {void}
   * @example drawText(ctx, 0, 0, textFitResult)
   * @example drawText(ctx, 10, 20, textFitResult, 'strokeText', 'middle')
   */
  function drawText(
    context,
    fitResult,
    x = 0,
    y = 0,
    command = 'fillText', 
    verticalAlign = 'top'
  ) {
    if (command !== 'fillText' && command !== 'strokeText') {
      throw new Error(`drawText: invalid command '${command}'. Use 'fillText' or 'strokeText'.`);
    }
    if (verticalAlign !== 'top' && verticalAlign !== 'middle' && verticalAlign !== 'bottom') {
      throw new Error(`drawText: invalid verticalAlign '${verticalAlign}'. Use 'top', 'middle' or 'bottom'.`);
    }
    if (!Array.isArray(fitResult?.lines) || fitResult?.lines?.length < 1) {
      throw new Error(`drawText: invalid fitResult.lines. Expected array of lines.`);
    }
    if (typeof fitResult?.lineHeightPx !== 'number' || fitResult?.lineHeightPx <= 0) {  
      throw new Error(`drawText: invalid fitResult.lineHeightPx. Expected positive number.`);
    }
    if (typeof fitResult?.font !== 'string' || !fitResult?.font.trim()) { 
      throw new Error(`drawText: invalid fitResult.font. Expected non-empty string.`);
    }
    if (typeof fitResult?.fontSize !== 'number' || fitResult?.fontSize <= 0) {
      throw new Error(`drawText: invalid fitResult.fontSize. Expected positive number.`);
    }
    if (typeof context?.save !== 'function' || typeof context?.restore !== 'function') {
      throw new Error(`drawText: invalid context. Expected CanvasRenderingContext2D.`);
    }
    if (typeof x !== 'number' || typeof y !== 'number') {
      throw new Error(`drawText: invalid x or y position.`);
    }

    context.save();
    context.font = fitResult.font;
    context.textBaseline = 'top';

    const totalHeight = fitResult.lines.length * fitResult.lineHeightPx;
    let yStart = y;
    if (verticalAlign === 'middle') {
      yStart = y + (fitResult.height - totalHeight) / 2;
    } else if (verticalAlign === 'bottom') {
      yStart = y + (fitResult.height - totalHeight);
    }

    let xStart = x;
    if (context.textAlign === 'center') {
      xStart = x + fitResult.width / 2;
    } else if (context.textAlign === 'right') {
      xStart = x + fitResult.width;
    }

    for (let i = 0; i < fitResult.lines.length; i++) {
      if (command === 'fillText') {
        context.fillText(fitResult.lines[i], xStart, yStart + i * fitResult.lineHeightPx);
      } else {
        context.strokeText(fitResult.lines[i], xStart, yStart + i * fitResult.lineHeightPx);
      }
    }

    context.restore();
  }

  function setFont(context, size, fontTemplate) {
    context.font = fontTemplate.build(size);
  }

  function round3(n) { return Math.floor(n * 1000) / 1000; }

  function createFontTemplate(fontString) {
    const fallback = {
      style: 'normal',
      weight: 'normal',
      build: (size) => `${size}px sans-serif`
    };

    if (typeof fontString !== 'string' || !fontString.trim()) {
      return fallback;
    }

    const match = fontString.match(/^(.*?)(\d*\.?\d+)([a-zA-Z%]+)(.*)$/);
    if (!match) {
      return fallback;
    }

    const prefix = match[1];
    const sizeValue = Number.parseFloat(match[2]);
    const unit = match[3];
    const suffix = match[4];
    const sizePx = convertFontSizeToPx(sizeValue, unit);
    if (!Number.isFinite(sizePx)) {
      return fallback;
    }
    const styleTokens = prefix.trim().split(/\s+/).filter(Boolean);
    const style = styleTokens.find(token => token === 'italic' || token === 'oblique') || 'normal';
    const weight = styleTokens.find(token => token === 'bold' || token === 'bolder' || token === 'lighter' || /^\d{3}$/.test(token)) || 'normal';

    // Preserve original style/family and just swap in the target pixel size.
    return {
      style,
      weight,
      baseSize: sizePx,
      unit,
      build: (size) => `${prefix}${size}px${suffix}`
    };
  }

  function convertFontSizeToPx(value, unit) {
    const normalizedUnit = unit.toLowerCase()
    switch (normalizedUnit) {
      case 'px':
        return value;
      case 'pt':
        return value * (96 / 72);
      case 'pc':
        return value * 16;
      case 'in':
        return value * 96;
      case 'cm':
        return value * (96 / 2.54);
      case 'mm':
        return value * (96 / 25.4);
      case 'q':
        return value * (96 / 101.6);
      case 'em':
      case 'rem':
        return value * 16;
      default:
        return Number.NaN;
    }
  }

  function tokenize(text, { preserveMultipleSpaces }) {
    const tokens = [];
    const parts = text.split('\n');
    parts.forEach((line, i) => {
      if (preserveMultipleSpaces) {
        const regex = /(\s+|\S+)/g;
        const matches = line.match(regex) || [];
        for (const m of matches) {
          if (/^\s+$/.test(m)) {
            for (let k = 0; k < m.length; k++) tokens.push({ type: 'space', text: ' ' });
          } else {
            tokens.push({ type: 'word', text: m });
          }
        }
      } else {
        const words = line.trim().split(/\s+/).filter(Boolean);
        for (let w = 0; w < words.length; w++) {
          tokens.push({ type: 'word', text: words[w] });
          if (w !== words.length - 1) tokens.push({ type: 'space', text: ' ' });
        }
      }
      if (i !== parts.length - 1) tokens.push({ type: 'break' });
    });
    return tokens;
  }

  function wrapTokens({
      rectWidth,
      tokens,
      measureText,
      hyphen,
      hyphenate,
      breakLongWords,
      removeLeadingSpaces,
      removeTrailingSpaces,
      epsilon
    }) {
      const lines = [];
      let currentLine = [];
      let currentWidth = 0;
      const spaceWidth = measureText(' ') ?? 0;

      const flushLine = () => {
        if (removeLeadingSpaces) {
          while (currentLine[0]?.type === 'space') {
            currentWidth -= spaceWidth;
            currentLine.shift();
          }
        }
        if (removeTrailingSpaces) {
          while (currentLine[currentLine.length - 1]?.type === 'space') {
            currentWidth -= spaceWidth;
            currentLine.pop();
          }
        }
        lines.push(currentLine.map(t => t.text).join(''));
        currentLine = [];
        currentWidth = 0;
      };

      for (const token of tokens) {
        if (token.type === 'break') {
          flushLine();
          continue;
        }
        const tokenWidth = token.type === 'space' ? spaceWidth : measureText(token.text);
        if (currentWidth + tokenWidth <= rectWidth + epsilon) {
          currentLine.push(token);
          currentWidth += tokenWidth;
          continue;
        }
        if (token.type === 'space') {
          if (currentLine.length) flushLine();
          continue;
        }

        const singleTooWide = tokenWidth > rectWidth + epsilon;
        if (singleTooWide && breakLongWords) {
          const segments = breakWordIntoSegments({
            word: token.text,
            rectWidth,
            currentWidth,
            measureText,
            hyphen,
            hyphenate,
            epsilon
          });
          for (const segment of segments) {
            const segmentWidth = measureText(segment);
            if (currentWidth + segmentWidth <= rectWidth + epsilon) {
              currentLine.push({ type: 'word', text: segment });
              currentWidth += segmentWidth;
            } else {
              flushLine();
              currentLine.push({ type: 'word', text: segment });
              currentWidth = segmentWidth;
            }
          }
          continue;
        }

        flushLine();
        currentLine.push({ type: 'word', text: token.text });
        currentWidth = tokenWidth;
      }

      if (currentLine.length) flushLine();
      return { lines };
    }

    function breakWordIntoSegments({
      word,
      rectWidth,
      currentWidth,
      measureText,
      hyphen,
      hyphenate,
      epsilon
    }) {
      const segments = [];
      let start = 0;
      const hyphenWidth = hyphenate ? measureText(hyphen) : 0;

      while (start < word.length) {
        const maxOnThisLine = Math.max(0, rectWidth - currentWidth);
        if (maxOnThisLine <= epsilon) currentWidth = 0;

        let lo = 1;
        let hi = word.length - start;
        let bestLen = 1;

        while (lo <= hi) {
          const mid = (lo + hi) >> 1;
          const substr = word.slice(start, start + mid);
          const continued = start + mid < word.length;
          const widthWithHyphen = measureText(substr) + (hyphenate && continued ? hyphenWidth : 0);
          if (widthWithHyphen <= maxOnThisLine + epsilon) {
            bestLen = mid;
            lo = mid + 1;
          } else {
            hi = mid - 1;
          }
        }

        let piece = word.slice(start, start + bestLen);
        const continued = start + bestLen < word.length;
        if (hyphenate && continued) piece += hyphen;

        segments.push(piece);
        currentWidth += measureText(piece);
        start += bestLen;
        if (hyphenate && continued) currentWidth = 0;
      }

      return segments;
    }

export {
  fitText,
  drawText
}