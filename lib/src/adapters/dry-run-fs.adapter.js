import { RealFsAdapter } from './real-fs.adapter.js';
export class DryRunFsAdapter {
    #realFsAdapter = new RealFsAdapter();
    async fileExists(filePath) {
        console.log(`check if file '${filePath}' exists`);
        return this.#realFsAdapter.fileExists(filePath);
    }
    async dirExists(dirPath) {
        console.log(`check if dir '${dirPath}' exists`);
        return this.#realFsAdapter.dirExists(dirPath);
    }
    async readdir(dirPath, options) {
        console.log(`read dir '${dirPath}' recursive ${options?.recursive}`);
        return this.#realFsAdapter.readdir(dirPath, options);
    }
    async mkdir(dirPath) {
        console.log(`create dir '${dirPath}'`);
    }
    async readFile(filePath) {
        console.log(`read file '${filePath}'`);
        return this.#realFsAdapter.readFile(filePath);
    }
    async writeFile(filePath, _content) {
        console.log(`write file '${filePath}'`);
    }
    async copyFile(srcPath, distPath) {
        console.log(`copy file '${srcPath}' -> '${distPath}'`);
    }
    async rm(dirPath) {
        console.log(`remove dir '${dirPath}'`);
    }
    async unlink(filePath) {
        console.log(`remove file '${filePath}'`);
    }
    async cp(srcDirPath, distDirPath) {
        console.log(`copy dir '${srcDirPath}' -> '${distDirPath}'`);
    }
}
//# sourceMappingURL=dry-run-fs.adapter.js.map