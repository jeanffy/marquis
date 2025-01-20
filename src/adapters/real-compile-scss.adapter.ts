import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import * as sass from 'sass';
import { CompileScssPort } from '../ports/compile-scss.port.js';

export class RealCompileScssAdapter implements CompileScssPort {
  public async compile(inputPath: string): Promise<string> {
    const scssContent = await fs.readFile(inputPath, { encoding: 'utf-8' });
    const compiled = sass.compileString(scssContent, {
      style: process.env.MARQUIS_BUILD_PROD === '1' ? 'compressed' : 'expanded',
      importers: [
        {
          findFileUrl(url: string): URL {
            // given:
            // - src/
            //   - assets/
            //     - styles/
            //       - _vars.scss
            //   - views/
            //     - home/
            //       - home.scss
            // with @import '../../assets/styles/vars'; in home.scss

            // if inputPath = 'src/views/home/home.scss' -> styleDir = 'src/views/home'
            const styleDir = path.parse(inputPath).dir;
            // if url = '../../assets/styles/vars' -> urlResolved = 'src/views/home/../../assets/styles/vars' -> 'src/assets/styles/vars'
            const urlResolved = path.resolve(path.join(styleDir, url));

            return new URL(pathToFileURL(urlResolved));
          },
        },
      ],
    });
    return compiled.css;
  }
}
