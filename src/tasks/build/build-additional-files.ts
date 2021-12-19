import * as fs from 'fs/promises';
import * as path from 'path';
import { CONFIG, OUTDIR, PROJDIR } from '../../context';
import { logAction, logActionProgress } from '../../helper';

export async function buildAdditionalFiles(): Promise<void> {
  if (CONFIG.additionalFiles === undefined) {
    return;
  }

  logAction('Copying additional files');

  for (const additionalFile of CONFIG.additionalFiles) {
    let src: string;
    let dst: string;
    if (typeof additionalFile === 'string') {
      src = additionalFile;
      dst = '';
    } else {
      src = additionalFile.src;
      dst = additionalFile.dst;
    }
    const fileName = path.parse(src);
    await fs.copyFile(path.join(PROJDIR, src), path.join(OUTDIR, dst, fileName.base));
    logActionProgress(`Emitted '${fileName.base}'`);
  }
}
