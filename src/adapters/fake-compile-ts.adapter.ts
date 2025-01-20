import { CompileTsPort } from '../ports/compile-ts.port.js';
import { FsPort } from '../ports/fs.port.js';

export class FakeCompileTsAdapter implements CompileTsPort {
  public constructor(private fsPort: FsPort) {}

  public async compile(inputPath: string): Promise<string> {
    const tsContent = await this.fsPort.readFile(inputPath);
    return tsContent;
  }
}
