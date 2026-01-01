/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  getErrorMessage,
  refreshServerHierarchicalMemory,
} from '@google/gemini-cli-core';

import { MessageType } from '../types.js';

import type { SlashCommand, SlashCommandActionReturn } from './types.js';

import { CommandKind } from './types.js';

import { strings } from '../../i18n.js';

export const memoryCommand: SlashCommand = {
  name: 'memory',

  description: strings.commandDescriptions['memory'],

  kind: CommandKind.BUILT_IN,

  autoExecute: false,

  subCommands: [
    {
      name: 'show',

      description: strings.commandDescriptions['memory show'],

      kind: CommandKind.BUILT_IN,

      autoExecute: true,

      action: async (context) => {
        const memoryContent = context.services.config?.getUserMemory() || '';

        const fileCount = context.services.config?.getGeminiMdFileCount() || 0;

        const messageContent =
          memoryContent.length > 0
            ? `Current memory content from ${fileCount} file(s):\n\n---\n${memoryContent}\n---`
            : 'Memory is currently empty.';

        context.ui.addItem(
          {
            type: MessageType.INFO,

            text: messageContent,
          },

          Date.now(),
        );
      },
    },

    {
      name: 'add',

      description: strings.commandDescriptions['memory add'],

      kind: CommandKind.BUILT_IN,

      autoExecute: false,

      action: (context, args): SlashCommandActionReturn | void => {
        if (!args || args.trim() === '') {
          return {
            type: 'message',

            messageType: 'error',

            content: 'Usage: /memory add <text to remember>',
          };
        }

        context.ui.addItem(
          {
            type: MessageType.INFO,

            text: `Attempting to save to memory: "${args.trim()}"`,
          },

          Date.now(),
        );

        return {
          type: 'tool',

          toolName: 'save_memory',

          toolArgs: { fact: args.trim() },
        };
      },
    },

    {
      name: 'refresh',

      description: strings.commandDescriptions['memory refresh'],

      kind: CommandKind.BUILT_IN,

      autoExecute: true,

      action: async (context) => {
        context.ui.addItem(
          {
            type: MessageType.INFO,

            text: 'Refreshing memory from source files...',
          },

          Date.now(),
        );

        try {
          const config = context.services.config;

          if (config) {
            let memoryContent = '';

            let fileCount = 0;

            if (config.isJitContextEnabled()) {
              await config.getContextManager()?.refresh();

              memoryContent = config.getUserMemory();

              fileCount = config.getGeminiMdFileCount();
            } else {
              const result = await refreshServerHierarchicalMemory(config);

              memoryContent = result.memoryContent;

              fileCount = result.fileCount;
            }

            await config.updateSystemInstructionIfInitialized();

            const successMessage =
              memoryContent.length > 0
                ? `Memory refreshed successfully. Loaded ${memoryContent.length} characters from ${fileCount} file(s).`
                : 'Memory refreshed successfully. No memory content found.';

            context.ui.addItem(
              {
                type: MessageType.INFO,

                text: successMessage,
              },

              Date.now(),
            );
          }
        } catch (error) {
          const errorMessage = getErrorMessage(error);

          context.ui.addItem(
            {
              type: MessageType.ERROR,

              text: `Error refreshing memory: ${errorMessage}`,
            },

            Date.now(),
          );
        }
      },
    },

    {
      name: 'list',

      description: strings.commandDescriptions['memory list'],

      kind: CommandKind.BUILT_IN,

      autoExecute: true,

      action: async (context) => {
        const filePaths = context.services.config?.getGeminiMdFilePaths() || [];
        const fileCount = filePaths.length;

        const messageContent =
          fileCount > 0
            ? `There are ${fileCount} GEMINI.md file(s) in use:\n\n${filePaths.join('\n')}`
            : 'No GEMINI.md files in use.';

        context.ui.addItem(
          {
            type: MessageType.INFO,
            text: messageContent,
          },
          Date.now(),
        );
      },
    },
  ],
};
