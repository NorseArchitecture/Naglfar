import { pathToFileURL } from 'node:url';
import path from 'node:path';

// Keyed off NORSE_BUILD_ARTIFACTS_DIR directly (persistent, User-scope, survives reboot —
// see scripts/Redirect-BuildArtifacts.ps1 and devcontainer.json) rather than a value handed
// down by the .NET build, so `npm run build`/`npm test` resolve identically whether invoked
// standalone or via `dotnet build`. The realm folder name (this file's grandparent dir) is
// derived, not hardcoded, so the same script works unmodified if another realm's npm build
// adopts this pattern.
const artifactsDir = process.env.NORSE_BUILD_ARTIFACTS_DIR;
const realmDir = path.basename(path.resolve(import.meta.dirname, '..'));
const externalDir = artifactsDir ? path.join(artifactsDir, realmDir, 'node_modules') : null;
const externalParentUrl = externalDir
	? pathToFileURL(externalDir.replace(/[\\/]+$/, '') + '/x.mjs').href
	: null;

function isBareSpecifier(specifier) {
	return !/^(\.|\/|#|node:|data:|file:)/.test(specifier);
}

// Node's ESM resolver walks up from the importing file looking for node_modules and
// ignores NODE_PATH (CommonJS-only), so an out-of-tree node_modules needs this hook
// instead. Default resolution runs first; only a bare specifier that genuinely isn't
// found retries against the artifacts-dir node_modules, so this is a no-op when
// NORSE_BUILD_ARTIFACTS_DIR is unset and node_modules is installed locally.
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
