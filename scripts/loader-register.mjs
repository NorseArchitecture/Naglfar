import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('./loader-resolve.mjs', pathToFileURL(import.meta.dirname + '/'));
