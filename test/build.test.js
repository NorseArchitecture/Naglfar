import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('tokens.css exposes --color-semantic-primary and a dark override', () => {
	const css = readFileSync(new URL('../dist/css/tokens.css', import.meta.url), 'utf8');
	assert.match(css, /--color-semantic-primary:\s*#[0-9a-f]{6};/);
	assert.match(css, /\[data-theme="dark"\]\s*{[^}]*--color-semantic-primary:\s*#[0-9a-f]{6};/s);
});

test('tokens.css exposes every semantic color role', () => {
	const css = readFileSync(new URL('../dist/css/tokens.css', import.meta.url), 'utf8');
	for (const role of ['primary', 'warning', 'danger', 'success', 'info', 'background', 'surface', 'border', 'text']) {
		assert.match(css, new RegExp(`--color-semantic-${role}:`), `missing --color-semantic-${role}`);
	}
});

test('tokens.json parses and resolves references to literal hex', () => {
	const json = JSON.parse(readFileSync(new URL('../dist/json/tokens.json', import.meta.url), 'utf8'));
	assert.equal(json.color.semantic.primary.light, '#b5610f');
	assert.equal(json.color.semantic.primary.dark, '#e08a1e');
});

test('tokens.js exports a flat named constant per color token', () => {
	const js = readFileSync(new URL('../dist/js/tokens.js', import.meta.url), 'utf8');
	assert.match(js, /export const ColorSemanticPrimaryLight = "#b5610f";/);
});
