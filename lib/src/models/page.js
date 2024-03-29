import path from 'path';
import { fileExists } from '../utils.js';
import { INPUT_SCRIPT_NAME_JS_SUFFIX, INPUT_SCRIPT_NAME_TS_SUFFIX, INPUT_STYLE_NAME_SUFFIX, INPUT_TEMPLATE_NAME_SUFFIX } from './config.js';
export async function createPage(config, i18n, lang, pageDir, pageName) {
    const templatePath = path.join(pageDir, pageName, `${pageName}.${INPUT_TEMPLATE_NAME_SUFFIX}`);
    const stylePath = path.join(pageDir, pageName, `${pageName}.${INPUT_STYLE_NAME_SUFFIX}`);
    const scriptJsPath = path.join(pageDir, pageName, `${pageName}.${INPUT_SCRIPT_NAME_JS_SUFFIX}`);
    const scriptTsPath = path.join(pageDir, pageName, `${pageName}.${INPUT_SCRIPT_NAME_TS_SUFFIX}`);
    const outputDir = path.join(config.output.rootOutputDir, config.pages.outputPagesFolderName, `${pageName}.${lang}`);
    let scriptPath;
    if (await fileExists(scriptJsPath)) {
        scriptPath = scriptJsPath;
    }
    else if (await fileExists(scriptTsPath)) {
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
//# sourceMappingURL=page.js.map