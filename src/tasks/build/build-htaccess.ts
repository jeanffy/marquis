import { OUTDIR } from '../../context';
import { exportTemplate, logAction } from '../../helper';
import { GeneratedPage } from './build-pages';

export async function buildHtaccess(pages: GeneratedPage[]): Promise<void> {
  logAction('Generating .htaccess');

  await exportTemplate('htaccess.twig', OUTDIR, '.htaccess', {
    pages: pages.map(p => p.name)
  });
}
