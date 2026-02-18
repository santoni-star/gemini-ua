/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { en } from './locales/en.js';
import { ua } from './locales/ua.js';
import type { TranslationStrings } from './locales/types.js';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';

const getLanguageFromSettings = (): string | undefined => {
  try {
    const settingsPath = path.join(os.homedir(), '.gemini', 'settings.json');
    if (fs.existsSync(settingsPath)) {
      const content = fs.readFileSync(settingsPath, 'utf-8');
      const settings = JSON.parse(content);
      return settings?.general?.language;
    }
  } catch {
    // Ignore errors reading settings
  }
  return undefined;
};

export const getLocale = (): string => {
  if (typeof process === 'undefined' || !process.env) {
    return 'ua';
  }

  // 1. Check environment variable
  const envLang = (
    process.env['GEMINI_CLI_LANG'] ||
    process.env['LANG'] ||
    process.env['LC_ALL'] ||
    ''
  ).toLowerCase();

  if (envLang.startsWith('en')) {
    return 'en';
  }
  if (envLang.startsWith('ua') || envLang.startsWith('uk')) {
    return 'ua';
  }

  // 2. Check settings file
  const settingsLang = getLanguageFromSettings();
  if (settingsLang === 'en') {
    return 'en';
  }
  if (settingsLang === 'ua' || settingsLang === 'uk') {
    return 'ua';
  }

  // Default to 'ua' for this localized fork.
  return 'ua';
};

const translations: Record<string, TranslationStrings> = {
  en,
  ua,
};

export const strings = translations[getLocale()] || en;

export const getStrings = (): TranslationStrings => strings;
