import { buildAdditionalFiles } from './build-additional-files';
import { buildAssets } from './build-assets';
import { buildHtaccess } from './build-htaccess';
import { buildIndexPhp } from './build-indexphp';
import { buildInit } from './build-init';
import { buildPages } from './build-pages';

export async function build(): Promise<void> {
  await buildInit();
  const pages = await buildPages();
  await buildAssets();
  await buildAdditionalFiles();
  await buildHtaccess(pages);
  await buildIndexPhp(pages);
}
