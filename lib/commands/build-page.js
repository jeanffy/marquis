import fs from 'node:fs/promises';
import path from 'node:path';
import * as sass from 'sass';
import { SCRIPT_TAG, STYLE_TAG } from '../models/config.js';
import { pathToFileURL } from 'node:url';
import { replaceI18N, replaceLang, replaceLangUrl, replacePageUrl, replaceAssetUrl, replaceAssetUrlForStyleNew } from '../replace.js';
import { twigRenderFilePromise } from '../utils.js';
import { createPage } from '../models/page.js';
import { ConsoleColors } from '../console-colors.js';
export default async function buildPage(params) {
    const page = await createPage(params.config, params.i18n, params.lang, params.inputFolder, params.name);
    const pageOutDir = path.join(params.outputFolder, `${params.name}.${params.lang}`);
    // template
    if (page.template.inputPath !== undefined) {
        let res = await twigRenderFilePromise(page.template.inputPath, {});
        res = await replaceI18N(params.i18n, res);
        res = await replaceLang(params.lang, res);
        res = await replaceLangUrl(params.config, res);
        res = await replacePageUrl(params.config, params.lang, res);
        res = await replaceAssetUrl(params.config, res);
        const styleInstruction = `${STYLE_TAG}()`;
        if (res.indexOf(styleInstruction) !== -1) {
            if (page.style.outputPath !== undefined) {
                const href = page.style.outputPath.slice(params.config.output.rootOutputDir.length + 1);
                res = res.replace(styleInstruction, `<link rel="stylesheet" href="/${href}"/>`);
            }
            else {
                res = res.replace(styleInstruction, '');
            }
        }
        const scriptInstruction = `${SCRIPT_TAG}()`;
        if (res.indexOf(scriptInstruction) !== -1) {
            if (page.style.outputPath !== undefined) {
                const src = page.style.outputPath.slice(params.config.output.rootOutputDir.length + 1);
                res = res.replace(scriptInstruction, `<script src="/${src}"></script>`);
            }
            else {
                res = res.replace(scriptInstruction, '');
            }
        }
        await fs.mkdir(pageOutDir, { recursive: true });
        await fs.writeFile(page.template.outputPath, res, { encoding: 'utf-8' });
    }
    // style
    if (page.style.inputPath !== undefined) {
        const scssContent = await fs.readFile(page.style.inputPath, { encoding: 'utf-8' });
        let res = sass.compileString(scssContent, {
            importers: [
                {
                    findFileUrl(url) {
                        // if page.style.inputPath = 'src/pages/home/home.style.scss' -> styleDir = 'src/pages/home'
                        const styleDir = path.parse(page.style.inputPath).dir;
                        // if url = '../../styles/vars' -> urlResolved = 'src/styles/vars'
                        const urlResolved = path.resolve(path.join(styleDir, url));
                        return new URL(pathToFileURL(urlResolved));
                    }
                }
            ]
        });
        let output = res.css;
        output = await replaceAssetUrlForStyleNew(params.config, pageOutDir, output);
        await fs.writeFile(page.style.outputPath, output, { encoding: 'utf-8' });
    }
    // script
    if (page.script.inputPath !== undefined) {
        let jsContent = await fs.readFile(page.script.inputPath, { encoding: 'utf-8' });
        jsContent = await replaceI18N(params.i18n, jsContent);
        await fs.writeFile(page.script.outputPath, jsContent, { encoding: 'utf-8' });
    }
    ConsoleColors.notice(`-> page: ${page.inputDir}/${page.name} -> ${page.outputDir}`);
    return page;
}
//# sourceMappingURL=build-page.js.map