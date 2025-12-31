/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { strings } from './src/i18n.js';

console.log('Language detected:', process.env.GEMINI_CLI_LANG || 'default');
console.log('Basics:', strings.help.basics);
console.log('Add Context:', strings.help.addContext);
console.log('Shell Mode:', strings.help.shellMode);
