/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { TranslationStrings } from './types.js';

export const uk: TranslationStrings = {
  help: {
    basics: 'Основи:',
    addContext: 'Додати контекст',
    addContextUsage: ': Використовуйте ',
    addContextExplanation: ' щоб вказати файли для контексту (наприклад, ',
    addContextSuffix: '), щоб обрати конкретні файли або папки.',
    shellMode: 'Режим оболонки',
    shellModeUsage: ': Виконуйте команди оболонки через ',
    shellModeExplanation: ' (наприклад, ',
    shellModeExample1: '!npm run start',
    shellModeOr: ') або використовуйте природну мову (наприклад, ',
    shellModeExample2: 'запустити сервер',
    shellModeSuffix: ').',
    commands: 'Команди:',
    shellCommandDesc: '- команда оболонки',
    mcpCommandDesc: '- команда Model Context Protocol (з зовнішніх серверів)',
    shortcuts: 'Клавіатурні скорочення:',
    shortcutJumpWords: '- Перехід між словами у полі вводу',
    shortcutQuit: '- Вийти з програми',
    shortcutNewLine: '- Новий рядок',
    shortcutNewLineLinux:
      '- Новий рядок (Alt+Enter працює в деяких дистрибутивах Linux)',
    shortcutClearScreen: '- Очистити екран',
    shortcutSelectionMode: '- Режим виділення тексту для копіювання',
    shortcutExternalEditor: '- Відкрити у зовнішньому редакторі',
    shortcutYoloMode: '- Перемкнути режим YOLO',
    shortcutSendMessage: '- Надіслати повідомлення',
    shortcutCancel:
      '- Скасувати операцію / Очистити поле вводу (подвійне натискання)',
    shortcutScroll: '- Прокрутка сторінки вгору/вниз',
    shortcutAutoAccept: '- Перемкнути авто-прийняття змін',
    shortcutHistory: '- Прокрутка історії запитів',
    fullListLink:
      'Повний список скорочень див. у docs/cli/keyboard-shortcuts.md',
  },
};
