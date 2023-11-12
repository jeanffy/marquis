import { ConsoleColors } from '../console-colors.js';
import { getPackageJson } from '../core.js';
import { stopContainer } from '../docker.js';
export async function stop(_args) {
    const userPackageJson = await getPackageJson();
    await stopContainer(userPackageJson.name);
    ConsoleColors.success('Development server successfully stopped');
}
//# sourceMappingURL=stop.js.map