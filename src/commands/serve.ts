import path from 'node:path';
import { ConsoleColors } from '../console-colors.js';
import { getConfig, getPackageJson } from '../core.js';
import { startContainer, stopContainer } from '../docker.js';

export async function serve(): Promise<void> {
  const userPackageJson = await getPackageJson();
  const containerName = userPackageJson.name;
  await stopContainer(containerName);

  const config = await getConfig();
  const htmlFolder = path.join(process.cwd(), 'dist');
  await startContainer({
    containerName,
    port: config.serve.port,
    htmlFolder,
  });

  ConsoleColors.success('Development server successfully started');
  ConsoleColors.info(`Open your browser on http://localhost:${config.serve.port}`);
}
