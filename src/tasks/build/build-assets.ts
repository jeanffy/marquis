import * as fs from 'fs/promises';
import * as ncp from 'ncp';
import * as path from 'path';
import * as util from 'util';
import { CONFIG, OUTDIR, PROJDIR } from '../../context';
import { logAction, logActionProgress } from '../../helper';

const ncpPromise = util.promisify(ncp);

export async function buildAssets(): Promise<void> {
  if (CONFIG.assets === undefined) {
    return;
  }

  logAction('Copying assets');

  const assetsFolderName = path.parse(CONFIG.assets.dir).base;
  await fs.mkdir(path.join(OUTDIR, assetsFolderName), { recursive: true });
  await ncpPromise(path.join(PROJDIR, CONFIG.assets.dir), path.join(OUTDIR, assetsFolderName))

  logActionProgress('Emitted assets');
}
