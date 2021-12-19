import { CONFIG, OUTDIR } from '../../context';
import { exportTemplate, logAction } from '../../helper';
import { GeneratedPage } from './build-pages';

export async function buildIndexPhp(pages: GeneratedPage[]): Promise<void> {
  logAction('Generating index.php');

  await exportTemplate('index.php.twig', OUTDIR, 'index.php', {
    defaultPage: CONFIG.pages.default,
    pages: pages.map(p => p.name)
  });
}
