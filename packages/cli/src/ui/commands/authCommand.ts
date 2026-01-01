/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  OpenDialogActionReturn,
  SlashCommand,
  LogoutActionReturn,
} from './types.js';
import { CommandKind } from './types.js';
import { clearCachedCredentialFile } from '@google/gemini-cli-core';
import { SettingScope } from '../../config/settings.js';
import { strings } from '../../i18n.js';

const authLoginCommand: SlashCommand = {
  name: 'login',
  description: strings.commandDescriptions['auth login'],
  kind: CommandKind.BUILT_IN,
  autoExecute: true,
  action: (_context, _args): OpenDialogActionReturn => ({
    type: 'dialog',
    dialog: 'auth',
  }),
};

const authLogoutCommand: SlashCommand = {
  name: 'logout',
  description: strings.commandDescriptions['auth logout'],
  kind: CommandKind.BUILT_IN,
  action: async (context, _args): Promise<LogoutActionReturn> => {
    await clearCachedCredentialFile();
    // Clear the selected auth type so user sees the auth selection menu
    context.services.settings.setValue(
      SettingScope.User,
      'security.auth.selectedType',
      undefined,
    );
    // Strip thoughts from history instead of clearing completely
    context.services.config?.getGeminiClient()?.stripThoughtsFromHistory();
    // Return logout action to signal explicit state change
    return {
      type: 'logout',
    };
  },
};

export const authCommand: SlashCommand = {
  name: 'auth',
  description: strings.commandDescriptions['auth'],
  kind: CommandKind.BUILT_IN,
  subCommands: [authLoginCommand, authLogoutCommand],
  action: (context, args) =>
    // Default to login if no subcommand is provided
    authLoginCommand.action!(context, args),
};
