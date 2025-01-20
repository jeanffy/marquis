export interface FsPortDirEnt {
    isDirectory: boolean;
    isFile: boolean;
    fullPath: string; // /path/to/file.ext
    parentPath: string; // /path/to
    name: string; // file.ext
    ext: string; // .ext
}

export interface FsPortReadDirOptions {
  recursive?: boolean;
}

export interface FsPort {
    fileExists(filePath: string): Promise<boolean>;
    dirExists(dirPath: string): Promise<boolean>;
    readdir(dirPath: string, options?: FsPortReadDirOptions): Promise<FsPortDirEnt[]>;
    mkdir(dirPath: string): Promise<void>;
    readFile(filePath: string): Promise<string>;
    writeFile(filePath: string, content: string): Promise<void>;
    copyFile(srcPath: string, distPath: string): Promise<void>;
    rm(dirPath: string): Promise<void>;
    unlink(filePath: string): Promise<void>;
    cp(srcDirPath: string, distDirPath: string): Promise<void>;
}
