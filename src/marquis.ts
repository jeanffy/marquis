#!/usr/bin/env node
import path from 'node:path';
import url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

await import(path.join(__dirname, 'main.js'));
