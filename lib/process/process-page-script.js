import * as fs from 'node:fs/promises';
import { replaceI18N } from '../replace.js';
export default async function processPageScript(ctx, page) {
    if (page.script.inputPath === undefined) {
        return;
    }
    let jsContent = await fs.readFile(page.script.inputPath, { encoding: 'utf-8' });
    jsContent = await replaceI18N(ctx.i18n, jsContent);
    await fs.writeFile(page.script.outputPath, jsContent, { encoding: 'utf-8' });
}
//# sourceMappingURL=process-page-script.js.map