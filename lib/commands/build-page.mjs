import fs from 'node:fs/promises';
import path from 'node:path';
import { SCRIPT_TAG, STYLE_TAG } from '../models/config.mjs';
import { replaceI18N, replaceLang, replaceLangUrl, replacePageUrl, replaceAssetUrl, replaceAssetUrlForStyle } from '../replace.mjs';
import { compileScss, twigRenderFilePromise } from '../utils.mjs';
import { createPage } from '../models/page.mjs';
import { ConsoleColors } from '../console-colors.mjs';
export default async function buildPage(params) {
    const page = await createPage(params.config, params.i18n, params.lang, params.inputFolder, params.name);
    const pageOutDir = path.join(params.outputFolder, `${params.name}.${params.lang}`);
    ConsoleColors.notice(`-> page: ${page.inputDir}/${page.name} -> ${page.outputDir}`);
    if (page.template.inputPath !== undefined) {
        ConsoleColors.notice(`   template: ${page.template.inputPath}`);
        let res = await twigRenderFilePromise(page.template.inputPath, {});
        res = await replaceI18N(params.i18n, res);
        res = await replaceLang(params.lang, res);
        res = await replaceLangUrl(params.config, res);
        res = await replacePageUrl(params.config, params.lang, res);
        res = await replaceAssetUrl(params.config, res);
        const styleInstruction = `${STYLE_TAG}()`;
        if (res.indexOf(styleInstruction) !== -1) {
            if (page.style.inputPath !== undefined) {
                const href = page.style.outputPath.slice(params.config.output.rootOutputDir.length + 1);
                res = res.replace(styleInstruction, `<link rel="stylesheet" href="/${href}"/>`);
            }
            else {
                res = res.replace(styleInstruction, '');
            }
        }
        const scriptInstruction = `${SCRIPT_TAG}()`;
        if (res.indexOf(scriptInstruction) !== -1) {
            if (page.script.inputPath !== undefined) {
                const src = page.script.outputPath.slice(params.config.output.rootOutputDir.length + 1);
                res = res.replace(scriptInstruction, `<script src="/${src}"></script>`);
            }
            else {
                res = res.replace(scriptInstruction, '');
            }
        }
        await fs.mkdir(pageOutDir, { recursive: true });
        await fs.writeFile(page.template.outputPath, res, { encoding: 'utf-8' });
    }
    if (page.style.inputPath !== undefined) {
        ConsoleColors.notice(`   style: ${page.template.inputPath}`);
        let output = await compileScss(page.style.inputPath);
        output = await replaceAssetUrlForStyle(params.config, pageOutDir, output);
        await fs.writeFile(page.style.outputPath, output, { encoding: 'utf-8' });
    }
    if (page.script.inputPath !== undefined) {
        ConsoleColors.notice(`   script: ${page.template.inputPath}`);
        let jsContent = await fs.readFile(page.script.inputPath, { encoding: 'utf-8' });
        jsContent = await replaceI18N(params.i18n, jsContent);
        await fs.writeFile(page.script.outputPath, jsContent, { encoding: 'utf-8' });
    }
    return page;
}
//# sourceMappingURL=build-page.mjs.map