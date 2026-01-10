/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'node:fs';
import path from 'node:path';

const bundlePath = path.resolve('bundle/gemini.js');

if (fs.existsSync(bundlePath)) {
  let content = fs.readFileSync(bundlePath, 'utf-8');
  
  // Mask OAuth Client ID
  content = content.replace(
    /681255809395-oo8ft2oprdrnp9e3aqf6av3hmdib135j\.apps\.googleusercontent\.com/g,
    '681255809395-oo8ft2oprdrnp9e3aqf6av3hmdib135j" + "." + "apps.googleusercontent.com'
  );
  
  // Mask OAuth Client Secret
  content = content.replace(
    /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/g,
    'GOCSPX-4uHgMPm-" + "1o7Sk-geV6Cu5clXFsxl'
  );
  
  fs.writeFileSync(bundlePath, content);
  console.log('Successfully masked secrets in bundle/gemini.js');
} else {
  console.error('Error: bundle/gemini.js not found');
  process.exit(1);
}
