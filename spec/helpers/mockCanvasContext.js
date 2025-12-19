export function createMockCanvasContext(params = {}) {
  const initialfont = params.initialFont ?? '20px Arial'
  const initialTextAlign = params.textAlign ?? 'left'
  const fontUpdates = []
  
  let _font = initialfont
  let _savedFont = initialfont
  let _textAlign = initialTextAlign
  let _savedTextalign = initialTextAlign

  const context = {
    get font() {
      return _font;
    },
    set font(value) {
      fontUpdates.push(value);
      _font = value;
    },
    measureText(str) {
      const sizeMatch = _font.match(/(\d+(?:\.\d+)?)/);
      const fontSizePx = sizeMatch ? Number(sizeMatch[1]) : 0;
      const width = fontSizePx * str.length;
      return { width };
    },
    save() {
      _savedFont = _font
      _savedTextalign = _textAlign
    },
    restore() {
      _font = _savedFont;
      _textAlign = _savedTextalign;},
    fillText() { /* no-op */ },
    strokeText() { /* no-op */ },
    get textAlign() { return _textAlign },
    set textAlign(value) { _textAlign = value}
  };

  return { context, fontUpdates };
}


//textAlign