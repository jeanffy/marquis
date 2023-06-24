import processPageTemplate from './process-page-template.js';
import processPageStyle from './process-page-style.js';
import processPageScript from './process-page-script.js';
import { Page, createPage } from '../models/page.js';
import { ProcessContext } from './process-context.js';
import { ConsoleColors } from '../console-colors.js';

export default async function processPage(ctx: ProcessContext, pageDir: string, pageName: string): Promise<Page> {
  const page = await createPage(ctx.config, ctx.i18n, ctx.lang, pageDir, pageName);

  await processPageTemplate(ctx, page);
  await processPageStyle(ctx, page);
  await processPageScript(ctx, page);

  ConsoleColors.notice(`-> page: ${pageDir}/${page.name} -> ${page.outputDir}`);

  return page;
}
