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
