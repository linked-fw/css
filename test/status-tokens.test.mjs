import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(
  new URL('../theme-defaults.css', import.meta.url),
  'utf8',
);

const statuses = ['ready', 'attention', 'blocked'];
const suffixes = ['', '-soft', '-text', '-border'];
const requiredTokens = statuses.flatMap((status) =>
  suffixes.map((suffix) => `status-${status}${suffix}`),
);

function declarationsFor(selector) {
  const selectorIndex = source.indexOf(selector);
  assert.notEqual(selectorIndex, -1, `missing ${selector} block`);

  const openingBrace = source.indexOf('{', selectorIndex);
  let depth = 0;
  for (let index = openingBrace; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1;
    if (source[index] === '}') depth -= 1;
    if (depth === 0) {
      const block = source.slice(openingBrace + 1, index);
      return new Set(
        [...block.matchAll(/--([a-zA-Z0-9-]+)\s*:/g)]
          .map((match) => match[1]),
      );
    }
  }

  assert.fail(`unterminated ${selector} block`);
}

test('exports the complete semantic status family in both theme modes', () => {
  const light = declarationsFor(':root');
  const dark = declarationsFor("[data-theme='dark']");

  for (const token of requiredTokens) {
    assert.ok(light.has(token), `light mode is missing --${token}`);
    assert.ok(dark.has(token), `dark mode is missing --${token}`);
  }
});
