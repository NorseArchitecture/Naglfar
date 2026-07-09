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

test('FluentTokenSeed.g.cs contains both constants with valid hex values, no light/dark split', () => {
	const cs = readFileSync(new URL('../dist/csharp/FluentTokenSeed.g.cs', import.meta.url), 'utf8');
	assert.match(cs, /namespace Norse\.DesignSystem;/);
	assert.match(cs, /public const string AccentBaseColor = "#b5610f";/);
	assert.match(cs, /public const string NeutralBaseColor = "#797265";/);
	assert.doesNotMatch(cs, /class Light/);
	assert.doesNotMatch(cs, /class Dark/);
});

test('typography, spacing, and radius primitives resolve in tokens.json', () => {
	const json = JSON.parse(readFileSync(new URL('../dist/json/tokens.json', import.meta.url), 'utf8'));
	assert.equal(json.font.family.body, "'Segoe UI', system-ui, -apple-system, sans-serif");
	assert.equal(json.font.size.base, '16px');
	assert.equal(json.font.weight.bold, 700);
	assert.equal(json.font.lineHeight.normal, 1.5);
	assert.equal(json.spacing['4'], '16px');
	assert.equal(json.radius.md, '8px');
});

test('elevation tokens are themed the same way color tokens are', () => {
	const css = readFileSync(new URL('../dist/css/tokens.css', import.meta.url), 'utf8');
	assert.match(css, /--elevation-1: 0 1px 2px rgba\(28, 26, 23, 0\.08\);/);
	assert.match(css, /\[data-theme="dark"\]\s*{[^}]*--elevation-1:/s);
});

test('component tokens resolve through semantic/spacing/radius references', () => {
	const json = JSON.parse(readFileSync(new URL('../dist/json/tokens.json', import.meta.url), 'utf8'));
	assert.equal(json.button.primary.background.light, '#b5610f');
	assert.equal(json.button.primary.background.dark, '#e08a1e');
	assert.equal(json.button.primary.radius, '8px');
	assert.equal(json.button.primary['padding-x'], '16px');
	assert.equal(json.input.default.radius, '8px');
	assert.equal(json.card.default.padding, '24px');
});
