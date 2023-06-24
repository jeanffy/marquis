import { ConsoleColors } from './console-colors.js';
import build from './commands/build.js';
import { serve } from './commands/serve.js';
//const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
async function main() {
    try {
        const args = process.argv.slice(2);
        if (args.length === 0) {
            console.log('Usage: marquis <command>');
            return;
        }
        const command = args[0];
        switch (command) {
            case 'build':
                await build();
                break;
            case 'serve':
                await serve();
                break;
            default: throw new Error(`Unknown command '${command}'`);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            ConsoleColors.error(error.message);
            ConsoleColors.error(error.stack ?? '<no stack>');
        }
        else {
            console.error(error);
        }
    }
}
main();
