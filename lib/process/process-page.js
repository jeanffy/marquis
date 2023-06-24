import processPageTemplate from './process-page-template.js';
import processPageStyle from './process-page-style.js';
import processPageScript from './process-page-script.js';
import { createPage } from '../models/page.js';
import { ConsoleColors } from '../console-colors.js';
export default async function processPage(ctx, pageDir, pageName) {
    const page = await createPage(ctx.config, ctx.i18n, ctx.lang, pageDir, pageName);
    await processPageTemplate(ctx, page);
    await processPageStyle(ctx, page);
    await processPageScript(ctx, page);
    ConsoleColors.notice(`-> page: ${pageDir}/${page.name} -> ${page.outputDir}`);
    return page;
}
//# sourceMappingURL=process-page.js.map