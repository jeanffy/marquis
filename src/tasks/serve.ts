import * as fs from 'fs/promises';
import * as path from 'path';
import { CACHEDIR, OUTDIR, PROJDIR } from '../context';
import { exportTemplate, promiseSpawn } from '../helper';

export async function serve(): Promise<void> {
  const userPackageJsonPath = path.join(PROJDIR, 'package.json');
  const userPackageJsonContent = JSON.parse(await fs.readFile(userPackageJsonPath, { encoding: 'utf-8' }));

  const dockerShPath = await exportTemplate('docker.sh.twig', CACHEDIR, 'docker.sh', {
    containerName: userPackageJsonContent.name,
    htmlFolder: OUTDIR
  });

  await promiseSpawn(`sh ${dockerShPath}`, {
    shell: true,
    stdio: 'inherit',
    //shell:
  });
  console.log(`Open your browser on http://localhost:8900`);
}
