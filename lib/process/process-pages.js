import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import processPage from './process-page.js';
export default async function processPages(ctx) {
    const pagesOutputFolderPath = path.join(ctx.config.output.rootOutputDir, ctx.config.pages.outputPagesFolderName, ctx.lang);
    await fs.mkdir(pagesOutputFolderPath, { recursive: true });
    let pagesEnt = await fs.readdir(ctx.config.pages.inputPagesDir, { withFileTypes: true });
    pagesEnt = pagesEnt.filter(p => p.isDirectory());
    const createdPages = [];
    for (const pageEnt of pagesEnt) {
        const createdPage = await processPage(ctx, pageEnt.path, pageEnt.name);
        createdPages.push(createdPage);
    }
    return createdPages;
}
