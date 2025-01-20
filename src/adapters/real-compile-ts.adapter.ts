import { exec, ExecOptions } from 'node:child_process';
import util from 'node:util';
import { CompileTsPort } from '../ports/compile-ts.port.js';

const promiseExec = util.promisify(exec);

export class RealCompileTsAdapter implements CompileTsPort {
  public async compile(inputPath: string): Promise<string> {
    let command = `npx esbuild "${inputPath}" --bundle`;
    if (process.env.MARQUIS_BUILD_PROD === '1') {
      command += ' --minify';
    }

    const execOptions: ExecOptions = {};
    const { stdout, stderr } = await promiseExec(command, execOptions);

    if (stderr.trim().length > 0) {
      throw new Error(stderr);
    }

    return stdout;
  }
}
