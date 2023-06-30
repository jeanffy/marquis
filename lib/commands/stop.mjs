import { ConsoleColors } from '../console-colors.mjs';
import { getPackageJson } from '../core.mjs';
import { stopContainer } from '../docker.mjs';
export async function stop() {
    const userPackageJson = await getPackageJson();
    await stopContainer(userPackageJson.name);
    ConsoleColors.success('Development server successfully stoped');
}
//# sourceMappingURL=stop.mjs.map