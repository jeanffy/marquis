import * as fs from 'node:fs/promises';
import { Config } from '../models/config.js';
import { ConsoleColors } from '../console-colors.js';

export default async function processAssets(config: Config): Promise<void> {
  await fs.mkdir(config.assets.outputAssetsDir, { recursive: true });
  await fs.cp(config.assets.inputAssetsDir, config.assets.outputAssetsDir, { recursive: true });
  ConsoleColors.info(`Assets: ${config.assets.inputAssetsDir} -> ${config.assets.outputAssetsDir}`);
}
