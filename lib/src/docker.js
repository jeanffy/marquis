import { ConsoleColors } from './console-colors.js';
import { execWithCapture, execWithoutCapture } from './utils.js';
export async function stopContainer(containerName) {
    const res = await execWithCapture(`docker ps -a -f name=^${containerName}$ -q`);
    if (res.stdout !== '') {
        ConsoleColors.notice(`Container ${containerName} already exists, removing it`);
        await execWithoutCapture(`docker rm -f ${containerName}`);
    }
}
export async function startContainer(params) {
    const runCmd = `docker run \
      -d \
      --rm \
      -p ${params.port}:80 \
      --name ${params.containerName} \
      -v ${params.htmlFolder}:/var/www/html \
      php:8-apache \
      /bin/bash -c 'a2enmod rewrite; apache2-foreground'`;
    await execWithoutCapture(runCmd);
}
//# sourceMappingURL=docker.js.map