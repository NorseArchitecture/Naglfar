import StyleDictionary from 'style-dictionary';

function cssVarName(token) {
	return token.path
		.filter((segment) => segment !== 'light' && segment !== 'dark')
		.join('-');
}

StyleDictionary.registerFormat({
	name: 'css/theme-variables',
	format: async ({ dictionary }) => {
		const light = dictionary.allTokens.filter((t) => t.path.at(-1) === 'light');
		const dark = dictionary.allTokens.filter((t) => t.path.at(-1) === 'dark');
		const themeless = dictionary.allTokens.filter(
			(t) => t.path.at(-1) !== 'light' && t.path.at(-1) !== 'dark',
		);

		const rootLines = [...themeless, ...light].map((t) => `  --${cssVarName(t)}: ${t.$value};`);
		const darkLines = dark.map((t) => `    --${cssVarName(t)}: ${t.$value};`);

		// Media-query-driven, not attribute-driven: nothing in the platform sets [data-theme]
		// yet (confirmed by search, 2026-07-12), and the actual requirement is "flip the OS/
		// browser preference and reload" — see the Theme Selection Machinery addendum, Decision 3.
		// A [data-theme] override can be layered on top later without touching this shape.
		return `:root {\n${rootLines.join('\n')}\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n${darkLines.join('\n')}\n  }\n}\n`;
	},
});

const sd = new StyleDictionary({
	source: ['tokens/**/*.json'],
	platforms: {
		css: {
			transformGroup: 'css',
			buildPath: 'dist/css/',
			files: [
				{
					destination: 'tokens.css',
					format: 'css/theme-variables',
				},
			],
		},
		cssWwwroot: {
			transformGroup: 'css',
			buildPath: 'src/DesignSystem.Tokens/wwwroot/',
			files: [
				{
					destination: 'norse-design-tokens.css',
					format: 'css/theme-variables',
				},
			],
		},
		js: {
			transformGroup: 'js',
			buildPath: 'dist/js/',
			files: [
				{
					destination: 'tokens.js',
					format: 'javascript/es6',
				},
			],
		},
		json: {
			transformGroup: 'js',
			buildPath: 'dist/json/',
			files: [
				{
					destination: 'tokens.json',
					format: 'json/nested',
				},
			],
		},
	},
});

await sd.buildAllPlatforms();
