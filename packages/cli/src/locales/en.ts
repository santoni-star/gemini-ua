/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { TranslationStrings } from './types.js';

export const en: TranslationStrings = {
  help: {
    basics: 'Basics:',
    addContext: 'Add context',
    addContextUsage: ': Use ',
    addContextExplanation: ' to specify files for context (e.g., ',
    addContextSuffix: ') to target specific files or folders.',
    shellMode: 'Shell mode',
    shellModeUsage: ': Execute shell commands via ',
    shellModeExplanation: ' (e.g., ',
    shellModeExample1: '!npm run start',
    shellModeOr: ') or use natural language (e.g. ',
    shellModeExample2: 'start server',
    shellModeSuffix: ').',
    commands: 'Commands:',
    shellCommandDesc: '- shell command',
    mcpCommandDesc: '- Model Context Protocol command (from external servers)',
    shortcuts: 'Keyboard Shortcuts:',
    shortcutJumpWords: '- Jump through words in the input',
    shortcutQuit: '- Quit application',
    shortcutNewLine: '- New line',
    shortcutNewLineLinux:
      '- New line (Alt+Enter works for certain linux distros)',
    shortcutClearScreen: '- Clear the screen',
    shortcutSelectionMode: '- Enter selection mode to copy text',
    shortcutExternalEditor: '- Open input in external editor',
    shortcutYoloMode: '- Toggle YOLO mode',
    shortcutSendMessage: '- Send message',
    shortcutCancel: '- Cancel operation / Clear input (double press)',
    shortcutScroll: '- Scroll page up/down',
    shortcutAutoAccept: '- Toggle auto-accepting edits',
    shortcutHistory: '- Cycle through your prompt history',
    fullListLink:
      'For a full list of shortcuts, see docs/cli/keyboard-shortcuts.md',
  },
};
