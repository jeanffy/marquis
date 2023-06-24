import fs from 'node:fs/promises';
import path from 'node:path';
import * as sass from 'sass';
import { replaceAssetUrlForStyle } from '../replace.js';
import { ProcessContext } from './process-context.js';
import { Page } from '../models/page.js';
import { pathToFileURL } from 'node:url';

export default async function processPageStyle(ctx: ProcessContext, page: Page): Promise<void> {
  if (page.style.inputPath === undefined) {
    return;
  }
  const scssContent = await fs.readFile(page.style.inputPath, { encoding: 'utf-8' });
  let res = sass.compileString(scssContent, {
    importers: [
      {
        findFileUrl(url: string): URL {
          // if page.style.inputPath = 'src/pages/home/home.style.scss' -> styleDir = 'src/pages/home'
          const styleDir = path.parse(page.style.inputPath!).dir;
          // if url = '../../styles/vars' -> urlResolved = 'src/styles/vars'
          const urlResolved = path.resolve(path.join(styleDir, url));
          return new URL(pathToFileURL(urlResolved));
        }
      }
    ]
  });
  let output = res.css;
  output = await replaceAssetUrlForStyle(ctx.config, page, output);
  await fs.writeFile(page.style.outputPath, output, { encoding: 'utf-8' });
}
