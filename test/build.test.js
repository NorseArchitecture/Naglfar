import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('tokens.css exposes --color-semantic-primary and a dark override', () => {
	const css = readFileSync(new URL('../dist/css/tokens.css', import.meta.url), 'utf8');
	assert.match(css, /--color-semantic-primary:\s*#[0-9a-f]{6};/);
	assert.match(css, /@media \(prefers-color-scheme: dark\)\s*{\s*:root\s*{[^}]*--color-semantic-primary:\s*#[0-9a-f]{6};/s);
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
	assert.match(css, /@media \(prefers-color-scheme: dark\)\s*{\s*:root\s*{[^}]*--elevation-1:\s*0 0 0 1px rgba\(246, 244, 240, 0\.06\);/s);
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

test('--bifrost-seam gradient token is built into both the light :root block and the dark override', () => {
	// bifrost.json's tokens are $type: "gradient", not "color" — the generic color sweep
	// below filters on $type === 'color' by construction and skips gradients entirely, so
	// this is the only coverage standing between a typo'd reference (or a rename) and a
	// silently green build. Asserts against the real resolved gradient shape, not a guess.
	const css = readFileSync(new URL('../dist/css/tokens.css', import.meta.url), 'utf8');
	// Scoped to the leading :root block (not just "anywhere in the file"), same as the dark
	// assertion below -- otherwise a formatter regression that emitted the light declaration
	// under the wrong selector would still pass.
	assert.match(
		css,
		/^:root\s*{[^}]*--bifrost-seam:\s*linear-gradient\(180deg,\s*#[0-9a-f]{6},\s*#[0-9a-f]{6},\s*#[0-9a-f]{6},\s*#[0-9a-f]{6},\s*#[0-9a-f]{6},\s*#[0-9a-f]{6}\);/i,
	);
	assert.match(
		css,
		/@media \(prefers-color-scheme: dark\)\s*{\s*:root\s*{[^}]*--bifrost-seam:\s*linear-gradient\(180deg,\s*#[0-9a-f]{6},\s*#[0-9a-f]{6},\s*#[0-9a-f]{6},\s*#[0-9a-f]{6},\s*#[0-9a-f]{6},\s*#[0-9a-f]{6}\);/is,
	);
	assert.equal(
		/^:root\s*{[^}]*--bifrost-seam: (linear-gradient\(180deg,[^;]+\));/.exec(css)[1],
		'linear-gradient(180deg, #c0392b, #e08a1e, #e0bd4a, #3f7d3f, #3468a6, #6d5bd0)',
	);
	assert.equal(
		/@media \(prefers-color-scheme: dark\)[\s\S]*?--bifrost-seam: (linear-gradient\(180deg,[^;]+\));/.exec(css)[1],
		'linear-gradient(180deg, #e0685a, #e08a1e, #e0bd4a, #6bab6b, #6d9bd1, #8b7ae0)',
	);
});

test('every color token in the source resolves to a valid 6-digit hex value', async () => {
	// Walks Style Dictionary's own resolved token list (typed, not the flattened JSON
	// output) so this catches every color token by $type — raw palette, semantic,
	// and component references alike — without hardcoding a single token name. A new
	// color token added to tokens/*.json is covered automatically.
	//
	// Uses getPlatformTokens(), not sd.allTokens directly: allTokens is populated at
	// init, before reference resolution, so a token like {color.semantic.primary.light}
	// still holds its unresolved "{color.amber.700}" reference string at that point.
	// getPlatformTokens() runs the same resolve step the real build platforms use.
	const { default: StyleDictionary } = await import('style-dictionary');
	const sd = new StyleDictionary({ source: ['tokens/**/*.json'], platforms: { probe: { transformGroup: 'css' } } });
	await sd.hasInitialized;
	const { allTokens } = await sd.getPlatformTokens('probe');

	const colorTokens = allTokens.filter((token) => token.$type === 'color');
	assert.ok(colorTokens.length > 0, 'expected at least one $type: "color" token to be defined');

	for (const token of colorTokens) {
		assert.match(
			token.$value,
			/^#[0-9a-f]{6}$/i,
			`${token.key} resolves to "${token.$value}", which is not a valid 6-digit hex color`,
		);
	}
});
