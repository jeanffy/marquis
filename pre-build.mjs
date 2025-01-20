import fs from 'node:fs';
import path from 'node:path';

const libDir = path.join(import.meta.dirname, 'lib');

function removeDir(dirPath) {
  console.log(`remove ${dirPath}`);
  fs.rmSync(dirPath, { recursive: true, force: true });
}

removeDir(libDir);
