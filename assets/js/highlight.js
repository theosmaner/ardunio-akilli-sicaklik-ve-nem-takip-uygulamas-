/*
 * Kodla — hafif Arduino C++ sözdizimi vurgulayıcı (bağımlılıksız)
 * KODLA.highlight(code) -> satır satır HTML dizisi döndürür.
 */
window.KODLA = window.KODLA || { chapters: [] };

(function () {
  var KEYWORDS = 'if else for while do switch case break continue return default const static volatile enum struct class sizeof new delete typedef public private using namespace goto'.split(' ');
  var TYPES = 'void int long float double bool boolean char byte word String unsigned signed short size_t uint8_t uint16_t uint32_t uint64_t int8_t int16_t int32_t int64_t auto'.split(' ');
  var CONSTS = 'HIGH LOW INPUT OUTPUT INPUT_PULLUP LED_BUILTIN true false NULL nullptr A0 A1 A2 A3 A4 A5 A6 A7 HEX DEC BIN FILE_WRITE FILE_READ'.split(' ');

  var kw = {}, ty = {}, cs = {};
  KEYWORDS.forEach(function (k) { kw[k] = 1; });
  TYPES.forEach(function (k) { ty[k] = 1; });
  CONSTS.forEach(function (k) { cs[k] = 1; });

  // Sıra önemlidir: önce yorumlar ve metinler, sonra diğerleri
  var TOKEN = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|(^[ \t]*#[a-z]+)|(<[\w./]+\.h(?:pp)?>)|(\b0[xX][0-9a-fA-F]+\b|\b0[bB][01]+\b|\b\d+(?:\.\d+)?[fFuUlL]*\b)|([A-Za-z_]\w*)|([\s\S])/gm;

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function tokenize(code) {
    var out = [], m;
    TOKEN.lastIndex = 0;
    while ((m = TOKEN.exec(code))) {
      var text = m[0], cls = null;
      if (m[1]) cls = 'c';
      else if (m[2]) cls = 's';
      else if (m[3]) cls = 'p';
      else if (m[4]) cls = 's';
      else if (m[5]) cls = 'n';
      else if (m[6]) {
        if (kw[text]) cls = 'k';
        else if (ty[text]) cls = 't';
        else if (cs[text]) cls = 'b';
        else if (/^[A-Z][A-Z0-9_]{2,}$/.test(text)) cls = 'b';           // SABITLER
        else if (code.charAt(TOKEN.lastIndex) === '(') cls = 'f';         // fonksiyon çağrısı
        else if (/^[A-Z]/.test(text)) cls = 'o';                           // Sınıf / nesne
      }
      var last = out[out.length - 1];
      if (!cls && last && !last.cls) last.text += text;
      else out.push({ cls: cls, text: text });
    }
    return out;
  }

  KODLA.highlight = function (code) {
    var lines = [''];
    tokenize(code).forEach(function (tok) {
      tok.text.split('\n').forEach(function (part, i) {
        if (i > 0) lines.push('');
        if (!part) return;
        lines[lines.length - 1] += tok.cls
          ? '<span class="tk-' + tok.cls + '">' + esc(part) + '</span>'
          : esc(part);
      });
    });
    return lines;
  };

  // "//: Türkçe || English" yorumlarını seçilen dile çevirir
  KODLA.localizeCode = function (code, lang) {
    return code.replace(/\/\/:\s?([^\n]*)/g, function (_, body) {
      var idx = body.lastIndexOf(' || ');
      if (idx === -1) return '// ' + body;
      return '// ' + (lang === 'en' ? body.slice(idx + 4) : body.slice(0, idx)).trim();
    });
  };
})();
