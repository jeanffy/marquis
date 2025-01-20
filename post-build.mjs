import fs from 'node:fs';
import path from 'node:path';

const srcRuntimeDir = path.join(import.meta.dirname, 'src', 'runtime');
const destRuntimeDir = path.join(import.meta.dirname, 'lib', 'src', 'runtime');

function copyFile(srcPath, destPath) {
  console.log(`${srcPath} -> ${destPath}`);
  const destDir = path.dirname(destPath);
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(srcPath, destPath);
}

function copyFolder(srcPath, destPath) {
  console.log(`${srcPath} -> ${destPath}`);
  fs.cpSync(srcPath, destPath, { recursive: true });
}

copyFile(path.join(srcRuntimeDir, 'docker-compose.yaml'), path.join(destRuntimeDir, 'docker-compose.yaml'));
copyFile(path.join(srcRuntimeDir, '.htaccess'), path.join(destRuntimeDir, '.htaccess'));
copyFolder(path.join(srcRuntimeDir, 'php'), path.join(destRuntimeDir, 'php'));
