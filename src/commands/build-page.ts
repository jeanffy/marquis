import fs from 'node:fs/promises';
import path from 'node:path';
import { ConsoleColors } from '../console-colors.js';
import { Config, SCRIPT_TAG, STYLE_TAG } from '../models/config.js';
import { I18N } from '../models/i18n.js';
import { createPage, Page } from '../models/page.js';
import {
  replaceAssetUrl,
  replaceAssetUrlForStyle,
  replaceI18N,
  replaceLang,
  replaceLangUrl,
  replacePageUrl,
} from '../replace.js';
import { compileScss, compileTypeScript, twigRenderFilePromise } from '../utils.js';

export interface BuildPageParams {
  config: Config;
  i18n: I18N;
  lang: string;
  inputFolder: string;
  name: string;
  outputFolder: string;
}

export default async function buildPage(params: BuildPageParams): Promise<Page> {
  const page = await createPage(params.config, params.i18n, params.lang, params.inputFolder, params.name);

  const pageOutDir = path.join(params.outputFolder, `${params.name}.${params.lang}`);

  ConsoleColors.notice(`-> page: ${page.inputDir}/${page.name} -> ${page.outputDir}`);

  // template

  if (page.template.inputPath !== undefined) {
    ConsoleColors.notice(`   template: ${page.template.inputPath}`);

    let res = await twigRenderFilePromise(page.template.inputPath, {});

    res = replaceI18N(params.i18n, res);
    res = replaceLang(params.lang, res);
    res = replaceLangUrl(params.config, res);
    res = replacePageUrl(params.config, params.lang, res);
    res = replaceAssetUrl(params.config, res);

    const styleInstruction = `${STYLE_TAG}()`;
    if (res.indexOf(styleInstruction) !== -1) {
      if (page.style.inputPath !== undefined) {
        const href = page.style.outputPath.slice(params.config.output.rootOutputDir.length + 1);
        res = res.replace(styleInstruction, `<link rel="stylesheet" href="/${href}"/>`);
      } else {
        res = res.replace(styleInstruction, '');
      }
    }

    const scriptInstruction = `${SCRIPT_TAG}()`;
    if (res.indexOf(scriptInstruction) !== -1) {
      if (page.script.inputPath !== undefined) {
        const src = page.script.outputPath.slice(params.config.output.rootOutputDir.length + 1);
        res = res.replace(scriptInstruction, `<script src="/${src}"></script>`);
      } else {
        res = res.replace(scriptInstruction, '');
      }
    }

    await fs.mkdir(pageOutDir, { recursive: true });
    await fs.writeFile(page.template.outputPath, res, { encoding: 'utf-8' });
  }

  // style

  if (page.style.inputPath !== undefined) {
    ConsoleColors.notice(`   style: ${page.template.inputPath}`);

    let output = await compileScss(page.style.inputPath);
    output = replaceAssetUrlForStyle(params.config, pageOutDir, output);
    await fs.writeFile(page.style.outputPath, output, { encoding: 'utf-8' });
  }

  // script

  if (page.script.inputPath !== undefined) {
    ConsoleColors.notice(`   script: ${page.script.inputPath}`);

    let jsContent = '';
    const extension = path.parse(page.script.inputPath).ext;
    if (extension === '.js') {
      jsContent = await fs.readFile(page.script.inputPath, { encoding: 'utf-8' });
    } else if (extension === '.ts') {
      jsContent = await compileTypeScript(page.script.inputPath, page.script.outputPath);
    } else {
      throw new Error(`Unrecognized script extension '${extension}'`);
    }

    jsContent = replaceI18N(params.i18n, jsContent);
    await fs.writeFile(page.script.outputPath, jsContent, { encoding: 'utf-8' });
  }

  return page;
}
