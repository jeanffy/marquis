import { ConsoleColors } from '../../console.colors';
import { buildAdditionalFiles } from './build-additional-files';
import { buildAssets } from './build-assets';
import { buildHtaccess } from './build-htaccess';
import { buildIndexPhp } from './build-indexphp';
import { buildInit } from './build-init';
import { buildPages } from './build-pages';
import { readCacheFile, writeCacheFile } from './cache';

export async function build(): Promise<void> {
  const start = new Date();

  const cache = await readCacheFile();

  await buildInit();
  const buildPagesResult = await buildPages(cache);
  await buildAssets();
  await buildAdditionalFiles();
  await buildHtaccess(buildPagesResult.generatedPages);
  await buildIndexPhp(buildPagesResult.generatedPages);

  await writeCacheFile(buildPagesResult.updatedCache);

  console.info(ConsoleColors.notice(`Build execution time: ${new Date().getTime() - start.getTime()} ms`));
}
