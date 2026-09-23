// Check repository-local Markdown links and HTML assets. Remote URLs are manual checks.
import { readdir, readFile, access } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(entries.filter(e => !e.name.startsWith('.')).map(e => {
    const path = resolve(dir, e.name);
    return e.isDirectory() ? files(path) : [path];
  }));
  return nested.flat();
}
let checked = 0;
const missing = [];
for (const file of await files(root)) {
  if (!['.md', '.html'].includes(extname(file))) continue;
  const source = (await readFile(file, 'utf8')).replace(/```[\s\S]*?```/g, '');
  const links = [...source.matchAll(/\]\(([^\s)]+)(?:\s+"[^"]*")?\)|(?:src|href)=["']([^"']+)["']/g)];
  for (const match of links) {
    const link = match[1] || match[2];
    if (/^(?:[a-z][a-z\d+.-]*:|#|\/\/)/i.test(link)) continue;
    const path = decodeURIComponent(link.split(/[?#]/)[0]);
    if (!path) continue;
    checked++;
    try { await access(resolve(dirname(file), path)); }
    catch { missing.push(`${file.slice(root.length)}: ${link}`); }
  }
}
if (missing.length) {
  console.error(missing.join('\n'));
  process.exitCode = 1;
} else console.log(`Local links and assets: ${checked} paths exist.`);
