import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import https from 'node:https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const bundleDir = path.join(root, 'bundle');
const dest = path.join(bundleDir, 'gemini.js');

if (!fs.existsSync(bundleDir)) {
  fs.mkdirSync(bundleDir, { recursive: true });
}

console.log('Downloading gemini.js bundle...');

const url = 'https://github.com/santoni-star/gemini-ua/raw/main/packages/cli/gemini-bin.js'; // Temporary link to a known working version or similar

// Use release or a specific commit for stability
const file = fs.createWriteStream(dest);
https.get(url, (response) => {
  if (response.statusCode !== 200 && response.statusCode !== 302) {
      console.error('Failed to download bundle: ' + response.statusCode);
      process.exit(1);
  }
  
  // Handle redirects
  if (response.statusCode === 302 || response.statusCode === 301) {
      https.get(response.headers.location, (res) => {
          res.pipe(file);
          file.on('finish', () => {
              file.close();
              console.log('Download complete.');
          });
      });
  } else {
      response.pipe(file);
      file.on('finish', () => {
          file.close();
          console.log('Download complete.');
      });
  }
}).on('error', (err) => {
  fs.unlink(dest, () => {});
  console.error('Download error: ' + err.message);
  process.exit(1);
});
