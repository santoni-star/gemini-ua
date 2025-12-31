/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { en } from './locales/en.js';
import { uk } from './locales/uk.js';
import type { TranslationStrings } from './locales/types.js';

const getLocale = (): string => {
  if (typeof process === 'undefined' || !process.env) {
    return 'en';
  }
  const envLang =
    process.env.GEMINI_CLI_LANG ||
    process.env.LANG ||
    process.env.LC_ALL ||
    'en_US';
  if (envLang.startsWith('uk')) {
    return 'uk';
  }
  return 'en';
};

const translations: Record<string, TranslationStrings> = {
  en,
  uk,
};

export const strings = translations[getLocale()] || en;
