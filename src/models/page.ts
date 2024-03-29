import path from 'path';
import { fileExists } from '../utils.js';
import { Config, INPUT_SCRIPT_NAME_JS_SUFFIX, INPUT_SCRIPT_NAME_TS_SUFFIX, INPUT_STYLE_NAME_SUFFIX, INPUT_TEMPLATE_NAME_SUFFIX } from './config.js';
import { I18N } from './i18n.js';

export interface PageElement {
  inputPath?: string;
  outputPath: string;
}

export interface Page {
  config: Config;
  i18n: I18N;
  lang: string;
  name: string;
  inputDir: string;
  outputDir: string;
  outputRelativeNameWithoutExt: string;
  template: PageElement;
  style: PageElement;
  script: PageElement;
  invisible: boolean;
}

export async function createPage(
  config: Config,
  i18n: I18N,
  lang: string,
  pageDir: string,
  pageName: string,
): Promise<Page> {
  const templatePath = path.join(pageDir, pageName, `${pageName}.${INPUT_TEMPLATE_NAME_SUFFIX}`);
  const stylePath = path.join(pageDir, pageName, `${pageName}.${INPUT_STYLE_NAME_SUFFIX}`);
  const scriptJsPath = path.join(pageDir, pageName, `${pageName}.${INPUT_SCRIPT_NAME_JS_SUFFIX}`);
  const scriptTsPath = path.join(pageDir, pageName, `${pageName}.${INPUT_SCRIPT_NAME_TS_SUFFIX}`);

  const outputDir = path.join(config.output.rootOutputDir, config.pages.outputPagesFolderName, `${pageName}.${lang}`);

  let scriptPath: string | undefined;
  if (await fileExists(scriptJsPath)) {
    scriptPath = scriptJsPath;
  } else if (await fileExists(scriptTsPath)) {
    scriptPath = scriptTsPath;
  }

  return {
    config: config,
    i18n: i18n,
    lang: lang,
    name: pageName,
    inputDir: pageDir,
    outputDir: outputDir,
    outputRelativeNameWithoutExt: path.join(config.pages.outputPagesFolderName, `${pageName}.${lang}`, pageName),
    template: {
      inputPath: (await fileExists(templatePath)) ? templatePath : undefined,
      outputPath: path.join(outputDir, `${pageName}.php`),
    },
    style: {
      inputPath: (await fileExists(stylePath)) ? stylePath : undefined,
      outputPath: path.join(outputDir, `${pageName}.css`),
    },
    script: {
      inputPath: scriptPath,
      outputPath: path.join(outputDir, `${pageName}.js`),
    },
    invisible: pageName === config.pages.defaultPage && config.pages.invisibleDefaultPage,
  };
}
