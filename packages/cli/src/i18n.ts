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
    return 'uk';
  }

  const lang = (
    process.env.GEMINI_CLI_LANG ||
    process.env.LANG ||
    process.env.LC_ALL ||
    ''
  ).toLowerCase();

  // Default to 'uk' unless English is explicitly requested

  if (lang.includes('en')) {
    return 'en';
  }

  return 'uk';
};

const translations: Record<string, TranslationStrings> = {
  en,
  uk,
};

export const strings = translations[getLocale()] || en;
