import childProcess from 'child_process';
import dotenv from 'dotenv';
import pathes from '../pathes.js';
dotenv.config();
export async function serveCommand(args) {
    if (args.length !== 1 || !['up', 'down'].includes(args[0])) {
        console.log('Usage: marquis serve <up|down>');
        return;
    }
    let command = '';
    switch (args[0]) {
        case 'up':
            command = `docker compose -f "${pathes.srcRuntimeDockerCompose}" up -d`;
            break;
        case 'down,':
            command = `docker compose -f "${pathes.srcRuntimeDockerCompose}" down`;
            break;
        default:
            console.log(`Unknown arg '${args[0]}'`);
            return;
    }
    console.log(`🏃 ${command}`);
    childProcess.execSync(command, { stdio: 'inherit' });
}
//# sourceMappingURL=serve.command.js.map