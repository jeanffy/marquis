import build from './commands/build.js';
import { serve } from './commands/serve.js';
import { stop } from './commands/stop.js';
import { ConsoleColors } from './console-colors.js';
async function main() {
    try {
        const args = process.argv.slice(2);
        if (args.length === 0) {
            ConsoleColors.info('Usage: marquis <command>');
            return;
        }
        const command = args[0];
        const commandArgs = args.slice(1);
        switch (command) {
            case 'build':
                await build(commandArgs);
                break;
            case 'serve':
                await serve();
                break;
            case 'stop':
                await stop();
                break;
            default:
                throw new Error(`Unknown command '${command}'`);
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
await main();
//# sourceMappingURL=main.js.map