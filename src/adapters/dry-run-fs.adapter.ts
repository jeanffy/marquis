import { FsPortDirEnt, FsPort, FsPortReadDirOptions } from '../ports/fs.port.js';
import { RealFsAdapter } from './real-fs.adapter.js';

export class DryRunFsAdapter implements FsPort {
  #realFsAdapter = new RealFsAdapter();

  public async fileExists(filePath: string): Promise<boolean> {
    console.log(`check if file '${filePath}' exists`);
    return this.#realFsAdapter.fileExists(filePath);
  }

  public async dirExists(dirPath: string): Promise<boolean> {
    console.log(`check if dir '${dirPath}' exists`);
    return this.#realFsAdapter.dirExists(dirPath);
  }

  public async readdir(dirPath: string, options?: FsPortReadDirOptions): Promise<FsPortDirEnt[]> {
    console.log(`read dir '${dirPath}' recursive ${options?.recursive}`);
    return this.#realFsAdapter.readdir(dirPath, options);
  }

  public async mkdir(dirPath: string): Promise<void> {
    console.log(`create dir '${dirPath}'`);
  }

  public async readFile(filePath: string): Promise<string> {
    console.log(`read file '${filePath}'`);
    return this.#realFsAdapter.readFile(filePath);
  }

  public async writeFile(filePath: string, _content: string): Promise<void> {
    console.log(`write file '${filePath}'`);
  }

  public async copyFile(srcPath: string, distPath: string): Promise<void> {
    console.log(`copy file '${srcPath}' -> '${distPath}'`);
  }

  public async rm(dirPath: string): Promise<void> {
    console.log(`remove dir '${dirPath}'`);
  }

  public async unlink(filePath: string): Promise<void> {
    console.log(`remove file '${filePath}'`);
  }

  public async cp(srcDirPath: string, distDirPath: string): Promise<void> {
    console.log(`copy dir '${srcDirPath}' -> '${distDirPath}'`);
  }
}
