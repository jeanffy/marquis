import * as fs from 'fs/promises';
import { CACHEDIR, OUTDIR } from '../context';
import { logAction } from '../helper';

export async function clean(): Promise<void> {
  logAction(`Cleaning outputDir '${OUTDIR}'`);
  await fs.rm(OUTDIR, { force: true, recursive: true });
  logAction(`Cleaning cache dir '${CACHEDIR}'`);
  await fs.rm(CACHEDIR, { force: true, recursive: true });
}
