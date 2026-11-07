import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Style Dictionary, loaded from wherever it was installed. node_modules lands under
// NORSE_BUILD_ARTIFACTS_DIR when that's set (persistent, User-scope, survives reboot; see
// scripts/Redirect-BuildArtifacts.ps1 and devcontainer.json), so a bare import can't find it from
// this tree. This is the only bare specifier the pipeline needs resolved that way: Style
// Dictionary's own dependencies resolve from its real location. The realm folder name is derived,
// not hardcoded, so the same script works unmodified if another realm adopts this pattern.
//
// bunfig.toml's auto = "disable" is what makes this safe. Bun's default would quietly fetch a
// missing package into its global cache, generating tokens from tooling bun.lock never saw.
const realmDir = path.resolve(import.meta.dirname, '..');
const artifactsDir = process.env.NORSE_BUILD_ARTIFACTS_DIR;
const installDir = artifactsDir ? path.join(artifactsDir, path.basename(realmDir)) : realmDir;

const { default: StyleDictionary } = await import(pathToFileURL(Bun.resolveSync('style-dictionary', installDir)).href);

export default StyleDictionary;
