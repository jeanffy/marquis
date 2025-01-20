import path from 'node:path';

import { FsPortDirEnt, FsPort, FsPortReadDirOptions } from '../ports/fs.port.js';

interface FsItem {
    itemPath: string;
    type: 'file' | 'dir';
    content: string;
}

export class MemoryFsAdapter implements FsPort {
    #files = new Map<string, FsItem>();

    public log(): void {
        console.log(this.#files);
    }

    public async fileExists(filePath: string): Promise<boolean> {
        const filePathNormalized = this.normalizePath(filePath);
        const item = this.#files.get(filePathNormalized);
        return item !== undefined && item.type === 'file';
    }

    public async dirExists(dirPath: string): Promise<boolean> {
        const dirPathNormalized = this.normalizePath(dirPath);
        const item = this.#files.get(dirPathNormalized);
        return item !== undefined && item.type === 'dir';
    }

    public async readdir(dirPath: string, options?: FsPortReadDirOptions): Promise<FsPortDirEnt[]> {
        const dirPathNormalized = this.normalizePath(dirPath);
        const pathFragmentCount = this.getPathFragments(dirPathNormalized).length;
        const items: FsItem[] = [];
        for (const file of this.#files.entries()) {
            if (file[0].startsWith(`${dirPathNormalized}/`)) {
                const item = file[1];
                if (options?.recursive === true) {
                  items.push(item);
                } else if (this.getPathFragments(item.itemPath).length === pathFragmentCount + 1) {
                  items.push(item);
                }
            }
        }
        return items.map(i => ({
            isFile: i.type === 'file',
            isDirectory: i.type === 'dir',
            fullPath: i.itemPath,
            parentPath: path.dirname(i.itemPath),
            name: path.basename(i.itemPath),
            ext: path.parse(i.itemPath).ext,
        }));
    }

    public async mkdir(dirPath: string): Promise<void> {
        const dirPathNormalized = this.normalizePath(dirPath);
        if (this.#files.has(dirPathNormalized)) {
            return;
        }
        this.ensureParentDirectoriesExist(dirPathNormalized);
        this.#files.set(dirPathNormalized, {
            type: 'dir',
            itemPath: dirPathNormalized,
            content: '',
        });
    }

    public async readFile(filePath: string): Promise<string> {
        const filePathNormalized = this.normalizePath(filePath);
        const item = this.#files.get(filePathNormalized);
        if (item === undefined) {
            throw new Error(`file not found '${filePathNormalized}'`);
        }
        if (item.type !== 'file') {
            throw new Error(`file at '${filePathNormalized}' is of type '${item.type}'`);
        }
        return item.content;
    }

    public async writeFile(filePath: string, content: string): Promise<void> {
        const filePathNormalized = this.normalizePath(filePath);
        this.checkParentDirectoriesExist(filePathNormalized);
        let file = this.#files.get(filePathNormalized);
        if (file === undefined) {
            file = {
                type: 'file',
                itemPath: filePath,
                content: '',
            };
            this.#files.set(filePath, file);
        }
        file.content = content;
    }

    public async copyFile(srcPath: string, distPath: string): Promise<void> {
        const srcPathNormalized = this.normalizePath(srcPath);
        const distPathNormalized = this.normalizePath(distPath);
        const srcItem = this.#files.get(srcPathNormalized);
        if (srcItem === undefined) {
            throw new Error(`file not found '${srcPathNormalized}'`);
        }
        this.checkParentDirectoriesExist(distPathNormalized);
        let distItem = this.#files.get(distPathNormalized);
        if (distItem !== undefined) {
            throw new Error(`destination already exists at '${distPathNormalized}' as a '${distItem.type}'`);
        }
        distItem = {
            type: 'file',
            itemPath: distPathNormalized,
            content: srcItem.content,
        };
        this.#files.set(distPathNormalized, distItem);
    }

    public async rm(_dirPath: string): Promise<void> {
      throw new Error('not implemented');
    }

    public async unlink(_filePath: string): Promise<void> {
      throw new Error('not implemented');
    }

    public async cp(_srcDirPath: string, _distDirPath: string): Promise<void> {
      throw new Error('not implemented');
    }

    // /path/to/../to/folder/file.ext -> /path/to/folder/file.ext
    // /path/to//folder/file.ext -> /path/to/folder/file.ext
    // /path/to/../to/folder/subDir/ -> /path/to/folder/subDir/
    private normalizePath(thePath: string): string {
        return path.normalize(thePath);
    }

    // /path/to/folder/file.ext
    // throws an exception if any of /path, /path/to, /path/to/folder items does not exist as a directory
    private checkParentDirectoriesExist(itemPathNormalized: string): void {
        let fragments = this.getPathFragments(path.dirname(itemPathNormalized));
        let itemPath = '';
        for (const fragment of fragments) {
            itemPath += `/${fragment}`;
            const item = this.#files.get(itemPath);
            if (item === undefined) {
                throw new Error(`directory does not exist '${itemPath}'`);
            }
            if (item.type !== 'dir') {
                throw new Error(`item at '${itemPath}' is not a directory`);
            }
        }
    }

    // /path/to/folder/file.ext
    // if needed, creates /path, /path/to, /path/to/folder items as directories
    private ensureParentDirectoriesExist(itemPathNormalized: string): void {
        let fragments = this.getPathFragments(path.dirname(itemPathNormalized));
        let itemPath = '';
        for (const fragment of fragments) {
            itemPath += `/${fragment}`;
            this.#files.set(itemPath, {
                type: 'dir',
                itemPath: itemPath,
                content: '',
            });
        }
    }

    private getPathFragments(itemPath: string): string[] {
        return itemPath.split('/').filter(f => f.length > 0);
    }
}
