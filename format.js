function lineRange(sel) {
  let start = sel.start.line;
  let end = sel.end.line;
  if (end > start && sel.end.character === 0) end--;
  return [start, end];
}

function format({ start, end, file, lines }) {
  const range = start === end ? `${start}` : `${start}-${end}`;
  if (!lines) return `line ${range} of @${file}`;
  return `Line ${range} of @${file}:\n${lines.map((l) => `> ${l}`).join('\n')}`;
}

module.exports = { format, lineRange };

if (require.main === module) {
  const assert = require('assert');
  assert.deepStrictEqual(lineRange({ start: { line: 1 }, end: { line: 4, character: 0 } }), [1, 3]);
  assert.deepStrictEqual(lineRange({ start: { line: 1 }, end: { line: 3, character: 2 } }), [1, 3]);
  assert.deepStrictEqual(lineRange({ start: { line: 2 }, end: { line: 2, character: 0 } }), [2, 2]);
  assert.strictEqual(
    format({ start: 3, end: 3, file: '/repo/a.js' }),
    'line 3 of @/repo/a.js'
  );
  assert.strictEqual(
    format({ start: 3, end: 3, file: 'a.js', lines: ['x'] }),
    'Line 3 of @a.js:\n> x'
  );
  assert.strictEqual(
    format({ start: 3, end: 5, file: 'src/a.js' }),
    'line 3-5 of @src/a.js'
  );
  assert.strictEqual(
    format({ start: 3, end: 5, file: 'src/a.js', lines: ['a', 'b', ''] }),
    'Line 3-5 of @src/a.js:\n> a\n> b\n> '
  );
  console.log('ok');
}
