import { CommonSpawnOptions, ExecOptions, exec, spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import util from 'node:util';
import twig from 'twig';

interface ErrorWithCode {
  code: string;
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch (error) {
    const prop: keyof ErrorWithCode = 'code';
    if (Object.prototype.hasOwnProperty.call(error, prop) && (error as ErrorWithCode).code === 'ENOENT') {
      // TODO: find some consntant for ENOENT
      return false;
    }
    throw error;
  }
}

export async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stats = await fs.stat(dirPath);
    return stats.isDirectory();
  } catch (error) {
    const prop = 'code';
    if (Object.prototype.hasOwnProperty.call(error, prop) && (error as ErrorWithCode).code === 'ENOENT') {
      // TODO: find some consntant for ENOENT
      return false;
    }
    throw error;
  }
}

export function twigRenderFilePromise(templatePath: string, options: twig.RenderOptions): Promise<string> {
  twig.cache(false);
  return new Promise((resolve, reject) => {
    twig.renderFile(templatePath, options, (error: Error, html: string) => {
      if (error) {
        return reject(error);
      }
      return resolve(html);
    });
  });
}

export interface shellHelperExecOpts {
  shell?: string;
}

export interface ShellHelperExecOutput {
  stdout?: string;
  stderr?: string;
}

export async function execWithCapture(command: string, options?: shellHelperExecOpts): Promise<ShellHelperExecOutput> {
  const execOptions: ExecOptions = {};
  if (options?.shell !== undefined) {
    execOptions.shell = options.shell;
  }
  const promiseExec = util.promisify(exec);
  const { stdout, stderr } = await promiseExec(command, execOptions);
  return {
    stdout: stdout,
    stderr: stderr
  };
}

export async function execWithoutCapture(command: string, options?: shellHelperExecOpts): Promise<void> {
  const spawnOptions: CommonSpawnOptions = {
    shell: true,
    stdio: 'inherit'
  };
  if (options?.shell !== undefined) {
    spawnOptions.shell = options?.shell;
  }
  return new Promise((resolve, reject) => {
    const process = spawn(command, spawnOptions);
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