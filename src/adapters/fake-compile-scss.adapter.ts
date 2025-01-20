import { CompileScssPort } from '../ports/compile-scss.port.js';
import { FsPort } from '../ports/fs.port.js';

export class FakeCompileScssAdapter implements CompileScssPort {
  public constructor(private fsPort: FsPort) {}

  public async compile(inputPath: string): Promise<string> {
    const scssContent = await this.fsPort.readFile(inputPath);
    return scssContent;
  }
}
