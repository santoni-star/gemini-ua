/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { TranslationStrings } from './types.js';

export const ua: TranslationStrings = {
  // Common UI elements
  promptPlaceholder: 'Запитайте що завгодно...',
  loading: 'Завантаження...',
  error: 'Помилка',
  confirm: 'Підтвердити',
  cancel: 'Скасувати',
  yes: 'Так',
  no: 'Ні',
  
  // CLI Commands & Descriptions
  commandAsk: 'Запитати Gemini',
  commandBuild: 'Побудувати проект',
  commandTest: 'Запустити тести',
  
  // Feedback
  submittingFeedback: 'Надсилання відгуку...',
  feedbackSuccess: 'Дякуємо за ваш відгук!',
  
  // Other UI strings
  workingOnIt: 'Працюю над цим...',
  calculating: 'Обчислення...',
  copyToClipboard: 'Копіювати в буфер',
  copied: 'Скопійовано!',
  
  // Error Messages
  networkError: 'Помилка мережі. Перевірте з’єднання.',
  authError: 'Помилка авторизації. Спробуйте gcloud auth login.',
  unexpectedError: 'Сталася неочікувана помилка.',
};
