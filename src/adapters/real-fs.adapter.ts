import fs from 'node:fs/promises';
import path from 'node:path';

import { FsPortDirEnt, FsPort, FsPortReadDirOptions } from '../ports/fs.port.js';

export class RealFsAdapter implements FsPort {
    public async fileExists(filePath: string): Promise<boolean> {
      try {
        const stat = await fs.stat(filePath);
        return stat.isFile();
      } catch (error) {
        if (Object.prototype.hasOwnProperty.call(error, 'code') && (error as any).code === 'ENOENT') {
          return false;
        }
        throw error;
      }
    }

    public async dirExists(dirPath: string): Promise<boolean> {
      try {
        const stat = await fs.stat(dirPath);
        return stat.isDirectory();
      } catch (error) {
        if (Object.prototype.hasOwnProperty.call(error, 'code') && (error as any).code === 'ENOENT') {
          return false;
        }
        throw error;
      }
    }

    public async readdir(dirPath: string, options?: FsPortReadDirOptions): Promise<FsPortDirEnt[]> {
      const items = await fs.readdir(dirPath, { withFileTypes: true, recursive: options?.recursive ?? false });
      return items.map(i => ({
        isFile: i.isFile(),
        isDirectory: i.isDirectory(),
        fullPath: path.join(i.parentPath, i.name),
        parentPath: i.parentPath,
        name: i.name,
        ext: path.parse(i.name).ext,
      }));
    }

    public async mkdir(dirPath: string): Promise<void> {
      await fs.mkdir(dirPath, { recursive: true });
    }

    public async readFile(filePath: string): Promise<string> {
      return await fs.readFile(filePath, { encoding: 'utf-8' });
    }

    public async writeFile(filePath: string, content: string): Promise<void> {
      return fs.writeFile(filePath, content, { encoding: 'utf-8' });
    }

    public async copyFile(srcPath: string, distPath: string): Promise<void> {
      return fs.copyFile(srcPath, distPath);
    }

    public async rm(dirPath: string): Promise<void> {
      return fs.rm(dirPath, { recursive: true });
    }

    public async unlink(filePath: string): Promise<void> {
      return fs.unlink(filePath);
    }

    public async cp(srcDirPath: string, distDirPath: string): Promise<void> {
      return fs.cp(srcDirPath, distDirPath, { recursive: true });
    }
}
