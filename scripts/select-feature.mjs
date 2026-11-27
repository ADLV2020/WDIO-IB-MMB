// scripts/select-feature.mjs

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const featuresRoot = path.resolve(process.cwd(), 'src/features');
const stateFile = path.resolve(process.cwd(), '.vscode/.selected-spec');

function scanFeatures(dir, baseDir = dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      const subItems = scanFeatures(fullPath, baseDir);
      if (subItems.length > 0) {
        results.push({ label: `[Carpeta] src/features/${relPath}/**/*.feature`, spec: `./src/features/${relPath}/**/*.feature` });
        results.push(...subItems);
      }
    } else if (entry.isFile() && entry.name.endsWith('.feature')) {
      results.push({ label: `[Feature] src/features/${relPath}`, spec: `./src/features/${relPath}` });
    }
  }
  return results;
}

const items = [
  { label: '[Todos]   Ejecutar todos los features (src/features/**/*.feature)', spec: './src/features/**/*.feature' },
  ...scanFeatures(featuresRoot)
];

console.log('\n=== Selecciona el Feature o Carpeta a ejecutar ===');
items.forEach((item, index) => {
  console.log(`  [${index}] ${item.label}`);
});

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.question('\nIntroduce el número (Enter para 0): ', (answer) => {
  const choice = answer.trim() === '' ? 0 : Number(answer.trim());
  const selected = items[choice] ?? items[0];

  fs.mkdirSync(path.dirname(stateFile), { recursive: true });
  fs.writeFileSync(stateFile, selected.spec, 'utf-8');
  console.log(`✅ Seleccionado: ${selected.spec}\n`);
  rl.close();
});
