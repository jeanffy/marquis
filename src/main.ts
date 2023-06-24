import * as fs from 'node:fs/promises';
import * as path from 'node:path';
// import * as url from 'node:url';
// import * as util from 'node:util';
import * as jsYaml from 'js-yaml';
import { Config } from './models/config.js';
import processAssets from './process/process-assets.js';
import createHtAccess from './create-htaccess.js';
import processLanguage from './process/process-language.js';
import { Page } from './models/page.js';
import { ConsoleColors } from './console-colors.js';
import build from './commands/build.js';
import { serve } from './commands/serve.js';

//const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

async function main(): Promise<void> {
  try {
    const args = process.argv.slice(2);
    if (args.length === 0) {
      console.log('Usage: marquis <command>');
      return;
    }

    const command = args[0];
    switch (command) {
      case 'build': await build(); break;
      case 'serve': await serve(); break;
      default: throw new Error(`Unknown command '${command}'`);
    }
  } catch (error) {
    if (error instanceof Error) {
      ConsoleColors.error(error.message);
    ConsoleColors.error(error.stack ?? '<no stack>');
    } else {
      console.error(error);
    }
  }
}

main();
