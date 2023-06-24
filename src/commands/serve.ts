import * as fs from 'fs/promises';
import * as path from 'path';
import { ConsoleColors } from '../console-colors.js';
import { execWithCapture, execWithoutCapture } from '../utils.js';

export async function serve(): Promise<void> {
  const userPackageJsonPath = path.join(process.cwd(), 'package.json');
  const userPackageJsonContent = await fs.readFile(userPackageJsonPath, { encoding: 'utf-8' });
  const userPackageJson = JSON.parse(userPackageJsonContent);

  const containerName = userPackageJson.name;

  const htmlFolder = path.join(process.cwd(), 'dist');

  const res = await execWithCapture(`docker ps -a -f name=^${containerName}$ -q`);
  if (res.stdout !== '') {
    ConsoleColors.notice(`Container ${containerName} already exists, removing it`);
    await execWithoutCapture(`docker rm -f ${containerName}`);
  }

  const runCmd = `docker run \
      -d \
      --rm \
      -p 8900:80 \
      --name ${containerName} \
      -v ${htmlFolder}:/var/www/html \
      php:8-apache \
      /bin/bash -c 'a2enmod rewrite; apache2-foreground'`;
  await execWithoutCapture(runCmd);

  ConsoleColors.success('Development server successfully started');
  ConsoleColors.info('Open your browser on http://localhost:8900');
}
