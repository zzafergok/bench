#!/usr/bin/env node

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const MAX_LINES = 250;
const ROOT_DIR = process.cwd();

const TARGET_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.mjs', '.css']);
const IGNORED_DIRS = new Set([
  'node_modules',
  '.next',
  'dist',
  'output',
  '.venv-markitdown',
  '.playwright-cli',
  '.git',
]);

function scanDirectory(dir, fileList = []) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry)) continue;
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      scanDirectory(fullPath, fileList);
    } else if (stat.isFile()) {
      const ext = entry.slice(entry.lastIndexOf('.'));
      if (TARGET_EXTENSIONS.has(ext)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

const filesToCheck = [
  ...scanDirectory(join(ROOT_DIR, 'apps')),
  join(ROOT_DIR, 'eslint.config.mjs'),
];

const violations = [];

for (const filePath of filesToCheck) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lineCount = content.split('\n').length;
    if (lineCount > MAX_LINES) {
      violations.push({
        file: relative(ROOT_DIR, filePath),
        lineCount,
      });
    }
  } catch (err) {
    console.error(`Dosya okunamadı: ${filePath}`, err);
  }
}

if (violations.length > 0) {
  console.error('\n❌ 250 Satır Protokolü İhlali Tespit Edildi:');
  console.error('──────────────────────────────────────────────────────');
  violations.sort((a, b) => b.lineCount - a.lineCount);
  for (const v of violations) {
    console.error(`  - ${v.file}: ${v.lineCount} satır (Azami: ${MAX_LINES})`);
  }
  console.error('──────────────────────────────────────────────────────');
  console.error(
    `Toplam ${violations.length} dosya 250 satır sınırını aşıyor. Lütfen modüler parçalara bölün.\n`,
  );
  process.exit(1);
} else {
  console.log(
    `\n✅ 250 Satır Protokolü: Tüm dosyalar (${filesToCheck.length} dosya) 250 satır sınırına uyuyor.\n`,
  );
  process.exit(0);
}
