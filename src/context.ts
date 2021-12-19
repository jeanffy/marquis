import * as fs from 'fs/promises';
import * as path from 'path';
import { MarquisConfig } from './config';

export const PROJDIR = process.cwd();
export const CACHEDIR = path.join(process.cwd(), '.marquis-cache');
export const LIBDIR = __dirname;
export let OUTDIR = '';
export let CONFIG: MarquisConfig;

export async function initContext(): Promise<void> {
  const configPath = path.join(PROJDIR, 'marquis.config.js');
  CONFIG = await import(configPath);

  await fs.mkdir(CACHEDIR, { recursive: true });

  OUTDIR = path.join(PROJDIR, (CONFIG.outputDir !== undefined ? CONFIG.outputDir : 'dist'));
}
