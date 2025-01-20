import { exec } from 'node:child_process';
import util from 'node:util';
const promiseExec = util.promisify(exec);
export class RealCompileTsAdapter {
    async compile(inputPath) {
        let command = `npx esbuild "${inputPath}" --bundle`;
        if (process.env.MARQUIS_BUILD_PROD === '1') {
            command += ' --minify';
        }
        const execOptions = {};
        const { stdout, stderr } = await promiseExec(command, execOptions);
        if (stderr.trim().length > 0) {
            throw new Error(stderr);
        }
        return stdout;
    }
}
//# sourceMappingURL=real-compile-ts.adapter.js.map