import * as path from 'path';
import { ConsoleColors } from '../console-colors.mjs';
import { startContainer, stopContainer } from '../docker.mjs';
import { getConfig, getPackageJson } from '../core.mjs';
export async function serve() {
    const userPackageJson = await getPackageJson();
    const containerName = userPackageJson.name;
    await stopContainer(containerName);
    const config = await getConfig();
    const htmlFolder = path.join(process.cwd(), 'dist');
    await startContainer({
        containerName,
        port: config.serve.port,
        htmlFolder
    });
    ConsoleColors.success('Development server successfully started');
    ConsoleColors.info(`Open your browser on http://localhost:${config.serve.port}`);
}
//# sourceMappingURL=serve.mjs.map