import { buildCommand } from './commands/build.command.js';
import { serveCommand } from './commands/serve.command.js';
async function main() {
    try {
        const args = process.argv.slice(2);
        if (args.length === 0) {
            console.log('Usage: marquis <command>');
            return;
        }
        const command = args[0];
        const commandArgs = args.slice(1);
        switch (command) {
            case 'build':
                await buildCommand(commandArgs);
                break;
            case 'serve':
                await serveCommand(commandArgs);
                break;
            default:
                throw new Error(`Unknown command '${command}'`);
        }
    }
    catch (error) {
        console.error(error);
    }
}
await main();
//# sourceMappingURL=main.js.map