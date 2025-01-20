import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import * as sass from 'sass';
export class RealCompileScssAdapter {
    async compile(inputPath) {
        const scssContent = await fs.readFile(inputPath, { encoding: 'utf-8' });
        const compiled = sass.compileString(scssContent, {
            style: process.env.MARQUIS_BUILD_PROD === '1' ? 'compressed' : 'expanded',
            importers: [
                {
                    findFileUrl(url) {
                        const styleDir = path.parse(inputPath).dir;
                        const urlResolved = path.resolve(path.join(styleDir, url));
                        return new URL(pathToFileURL(urlResolved));
                    },
                },
            ],
        });
        return compiled.css;
    }
}
//# sourceMappingURL=real-compile-scss.adapter.js.map