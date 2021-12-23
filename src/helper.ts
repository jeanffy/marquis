import { CommonSpawnOptions, spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as fsOLD from 'fs';
import * as path from 'path';
import * as twig from 'twig';
import { LIBDIR } from './context';
import { ConsoleColors } from './console.colors';

let actionId = 1;

export function logAction(message: string): void {
  console.log(ConsoleColors.info(`[${String(actionId).padStart(2, '0')}] ${message}`));
  actionId++;
}

export function logActionProgress(message: string, notImportant = false): void {
  if (notImportant) {
    console.log(ConsoleColors.notice(`     ${message}`));
  } else {
    console.log(ConsoleColors.success(`     ${message}`));
  }
}

export function twigRenderFilePromise(templatePath: string, options: twig.RenderOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    twig.renderFile(templatePath, options, (error: Error, html: string) => {
      if (error) {
        return reject(error);
      }
      return resolve(html);
    });
  });
}

export function promiseSpawn(command: string, options: CommonSpawnOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = spawn(command, options);
    process.on('close', (code: number) => {
      if (code !== 0) {
        reject(new Error(`Command ${command} exited with code ${code}`));
      }
      resolve();
    });
    process.on('error', (err) => {
      reject(err);
    });
  });
}

export interface ErrorWithCode {
  code: string;
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stat: fsOLD.Stats = await fs.stat(filePath);
    return stat.isFile();
  } catch (error) {
    const prop: keyof ErrorWithCode = 'code';
    if (Object.prototype.hasOwnProperty.call(error, prop) && (error as ErrorWithCode).code === 'ENOENT') { // TODO: find some consntant for ENOENT
      return false;
    }
    throw error;
  }
}

export async function callTwig(twigPath: string, outputPath: string, processFunc?: (content: string) => string, params?: any): Promise<string> {
  let generatedContent = await twigRenderFilePromise(twigPath, params || {});
  if (processFunc !== undefined) {
    generatedContent = processFunc(generatedContent);
  }
  await fs.writeFile(outputPath, generatedContent, { encoding: 'utf-8' });
  return outputPath;
}

export async function exportTemplate(tplName: string, outputFolder: string, fileName: string, params?: any): Promise<string> {
  const tplPath = path.join(LIBDIR, 'templates', tplName);
  const generatedPath = path.join(outputFolder, fileName);
  return callTwig(tplPath, generatedPath, undefined, params);
}

export interface PageInfo {
  pageType: 'twig' | 'php' | 'html';
  name: string;
  filePath: string;
}

export async function getFolderItems(folderPath: string, excludes?: string[]): Promise<PageInfo[]> {
  return (await fs.readdir(folderPath, { withFileTypes: true }))
    .filter(d => {
      if (excludes !== undefined && excludes.includes(d.name)) {
        return false;
      }
      if (d.isDirectory()) {
        return false;
      }
      return ['.twig', '.php', '.html'].includes(path.parse(d.name).ext);
    })
    .map(d => {
      const parsed = path.parse(d.name);
      const filePath = path.join(folderPath, d.name);
      switch (parsed.ext) {
        case '.twig': return { pageType: 'twig', name: parsed.name, filePath: filePath } as PageInfo;
        case '.php': return { pageType: 'php', name: parsed.name, filePath: filePath } as PageInfo;
        case '.html': return { pageType: 'html', name: parsed.name, filePath: filePath } as PageInfo;
        default: throw new Error('Internal error 1');
      }
    });
}

export async function fileAppend(filePath: string, toAppend: string): Promise<void> {
  const content = await fs.readFile(filePath, { encoding: 'utf-8' });
  await fs.writeFile(filePath, `${content}${toAppend}`);
}

export async function fileModifiedAt(filePath: string): Promise<Date> {
  const stat: fsOLD.Stats = await fs.stat(filePath);
  return stat.mtime;
}
