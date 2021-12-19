import * as fs from 'fs/promises';
import { OUTDIR } from '../../context';
import { logAction } from '../../helper';

export async function buildInit(): Promise<void> {
  // --------------------------------------------------------------
  // remove existing output
  // --------------------------------------------------------------

  logAction(`Cleaning outputDir '${OUTDIR}'`);

  await fs.rm(OUTDIR, { force: true, recursive: true });
  await fs.mkdir(OUTDIR, { recursive: true });
}
