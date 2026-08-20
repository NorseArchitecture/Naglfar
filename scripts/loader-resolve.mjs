import { pathToFileURL } from 'node:url';

const externalDir = process.env.NORSE_NPM_MODULES_DIR;
const externalParentUrl = externalDir
	? pathToFileURL(externalDir.replace(/[\\/]+$/, '') + '/x.mjs').href
	: null;

function isBareSpecifier(specifier) {
	return !/^(\.|\/|#|node:|data:|file:)/.test(specifier);
}

// Node's ESM resolver walks up from the importing file looking for node_modules and
// ignores NODE_PATH (CommonJS-only), so an out-of-tree node_modules needs this hook
// instead. Default resolution runs first; only a bare specifier that genuinely isn't
// found retries against NORSE_NPM_MODULES_DIR, so this is a no-op when node_modules
// is installed locally (e.g. running `npm run build` standalone, outside the .NET build).
export async function resolve(specifier, context, nextResolve) {
	try {
		return await nextResolve(specifier, context);
	} catch (err) {
		if (err?.code !== 'ERR_MODULE_NOT_FOUND' || !externalParentUrl || !isBareSpecifier(specifier)) {
			throw err;
		}
		return nextResolve(specifier, { ...context, parentURL: externalParentUrl });
	}
}
