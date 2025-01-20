import fs from 'node:fs/promises';
import path from 'node:path';
export class RealFsAdapter {
    async fileExists(filePath) {
        try {
            const stat = await fs.stat(filePath);
            return stat.isFile();
        }
        catch (error) {
            if (Object.prototype.hasOwnProperty.call(error, 'code') && error.code === 'ENOENT') {
                return false;
            }
            throw error;
        }
    }
    async dirExists(dirPath) {
        try {
            const stat = await fs.stat(dirPath);
            return stat.isDirectory();
        }
        catch (error) {
            if (Object.prototype.hasOwnProperty.call(error, 'code') && error.code === 'ENOENT') {
                return false;
            }
            throw error;
        }
    }
    async readdir(dirPath, options) {
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
    async mkdir(dirPath) {
        await fs.mkdir(dirPath, { recursive: true });
    }
    async readFile(filePath) {
        return await fs.readFile(filePath, { encoding: 'utf-8' });
    }
    async writeFile(filePath, content) {
        return fs.writeFile(filePath, content, { encoding: 'utf-8' });
    }
    async copyFile(srcPath, distPath) {
        return fs.copyFile(srcPath, distPath);
    }
    async rm(dirPath) {
        return fs.rm(dirPath, { recursive: true });
    }
    async unlink(filePath) {
        return fs.unlink(filePath);
    }
    async cp(srcDirPath, distDirPath) {
        return fs.cp(srcDirPath, distDirPath, { recursive: true });
    }
}
//# sourceMappingURL=real-fs.adapter.js.map