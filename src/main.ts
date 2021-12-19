#! /usr/bin/env node

import { build, clean, serve, watch } from './tasks';
import { initContext } from './context';

async function main(args: string[]): Promise<void> {
  try {
    if (args.length === 0) {
      console.log('Usage: marquis <command>');
      return;
    }

    await initContext();

    const command = args[0];
    switch (command) {
      case 'build': await build(); break;
      case 'watch': await watch(); break;
      case 'serve': await serve(); break;
      case 'clean': await clean(); break;
      default: throw new Error(`Unknown command '${command}'`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    //await fs.rm(TMPDIR, { force: true, recursive: true });
  }
}

main(process.argv.slice(2));
