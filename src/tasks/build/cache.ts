import * as fs from 'fs/promises';
import * as path from 'path';
import { CACHEDIR, CONFIG } from '../../context';
import { fileExists, fileModifiedAt } from '../../helper';

export type ISODate = string;

export interface BuildCachePage {
  path: string;
  lastModifiedAt: ISODate;
}

export interface BuildCache {
  pages: BuildCachePage[];
}

export async function readCacheFile(): Promise<BuildCache> {
  const cacheFilePath = path.join(CACHEDIR, 'data.json');
  let cacheFileContent: BuildCache = {
    pages: []
  };
  if (CONFIG.cache?.enabled === false) {
    return cacheFileContent;
  }
  if (await fileExists(cacheFilePath)) {
    cacheFileContent = JSON.parse(await fs.readFile(cacheFilePath, { encoding: 'utf-8' }));
  }
  return cacheFileContent;
}

export async function writeCacheFile(cache: BuildCache): Promise<void> {
  if (CONFIG.cache?.enabled === false) {
    return;
  }
  const cacheFilePath = path.join(CACHEDIR, 'data.json');
  await fs.writeFile(cacheFilePath, JSON.stringify(cache, undefined, 2), { encoding: 'utf-8' });
}

export async function fileHasNotChanged(cache: BuildCache, filePath: string): Promise<boolean> {
  const mtime = await fileModifiedAt(filePath);
  const cachePage = cache.pages.find(p => p.path === filePath);
  const fileHasChanged = (cachePage === undefined || cachePage.lastModifiedAt !== mtime.toISOString());
  if (fileHasChanged) {
    if (cachePage !== undefined) {
      cachePage.lastModifiedAt = mtime.toISOString();
    } else {
      cache.pages.push({
        path: filePath,
        lastModifiedAt: mtime.toISOString()
      });
    }
  }
  return !fileHasChanged;
}
