import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import processPage from './process-page.js';
import { ProcessContext } from './process-context.js';
import { Page } from '../models/page.js';

export default async function processPages(ctx: ProcessContext): Promise<Page[]> {
  const pagesOutputFolderPath = path.join(ctx.config.output.rootOutputDir, ctx.config.pages.outputPagesFolderName, ctx.lang);
  await fs.mkdir(pagesOutputFolderPath, { recursive: true });

  let pagesEnt = await fs.readdir(ctx.config.pages.inputPagesDir, { withFileTypes: true });
  pagesEnt = pagesEnt.filter(p => p.isDirectory());

  const createdPages: Page[] = [];

  for (const pageEnt of pagesEnt) {
    const createdPage = await processPage(ctx, pageEnt.path, pageEnt.name);
    createdPages.push(createdPage);
  }

  return createdPages;
}
