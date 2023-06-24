import * as fs from 'node:fs/promises';
import { SCRIPT_TAG, STYLE_TAG } from '../models/config.js';
import { twigRenderFilePromise } from '../utils.js';
import { replaceAssetUrl, replaceI18N, replaceLang, replaceLangUrl, replacePageUrl } from '../replace.js';
export default async function processPageTemplate(ctx, page) {
    if (page.template.inputPath === undefined) {
        return;
    }
    let res = await twigRenderFilePromise(page.template.inputPath, {});
    res = await replaceI18N(ctx.i18n, res);
    res = await replaceLang(ctx.lang, res);
    res = await replaceLangUrl(ctx.config, res);
    res = await replacePageUrl(ctx.config, ctx.lang, res);
    res = await replaceAssetUrl(ctx.config, res);
    const styleInstruction = `${STYLE_TAG}()`;
    if (res.indexOf(styleInstruction) !== -1) {
        if (page.style.inputPath !== undefined) {
            const href = page.style.outputPath.slice(ctx.config.output.rootOutputDir.length + 1);
            res = res.replace(styleInstruction, `<link rel="stylesheet" href="/${href}"/>`);
        }
        else {
            res = res.replace(styleInstruction, '');
        }
    }
    const scriptInstruction = `${SCRIPT_TAG}()`;
    if (res.indexOf(scriptInstruction) !== -1) {
        if (page.script.inputPath !== undefined) {
            const src = page.script.outputPath.slice(ctx.config.output.rootOutputDir.length + 1);
            res = res.replace(scriptInstruction, `<script src="/${src}"></script>`);
        }
        else {
            res = res.replace(scriptInstruction, '');
        }
    }
    await fs.writeFile(page.template.outputPath, res, { encoding: 'utf-8' });
}
