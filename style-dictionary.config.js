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
		const darkLines = dark.map((t) => `  --${cssVarName(t)}: ${t.$value};`);

		return `:root {\n${rootLines.join('\n')}\n}\n\n[data-theme="dark"] {\n${darkLines.join('\n')}\n}\n`;
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
	},
});

await sd.buildAllPlatforms();
