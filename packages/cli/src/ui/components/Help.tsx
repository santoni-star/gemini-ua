/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { type SlashCommand, CommandKind } from '../commands/types.js';
import { strings } from '../../i18n.js';

interface Help {
  commands: readonly SlashCommand[];
}

export const Help: React.FC<Help> = ({ commands }) => (
  <Box
    flexDirection="column"
    marginBottom={1}
    borderColor={theme.border.default}
    borderStyle="round"
    padding={1}
  >
    {/* Basics */}
    <Text bold color={theme.text.primary}>
      {strings.help.basics}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        {strings.help.addContext}
      </Text>
      {strings.help.addContextUsage}
      <Text bold color={theme.text.accent}>
        @
      </Text>{' '}
      {strings.help.addContextExplanation}
      <Text bold color={theme.text.accent}>
        @src/myFile.ts
      </Text>
      {strings.help.addContextSuffix}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        {strings.help.shellMode}
      </Text>
      {strings.help.shellModeUsage}
      <Text bold color={theme.text.accent}>
        !
      </Text>{' '}
      {strings.help.shellModeExplanation}
      <Text bold color={theme.text.accent}>
        {strings.help.shellModeExample1}
      </Text>
      {strings.help.shellModeOr}
      <Text bold color={theme.text.accent}>
        {strings.help.shellModeExample2}
      </Text>
      {strings.help.shellModeSuffix}
    </Text>

    <Box height={1} />

    {/* Commands */}
    <Text bold color={theme.text.primary}>
      {strings.help.commands}
    </Text>
    {commands
      .filter((command) => command.description && !command.hidden)
      .map((command: SlashCommand) => (
        <Box key={command.name} flexDirection="column">
          <Text color={theme.text.primary}>
            <Text bold color={theme.text.accent}>
              {' '}
              /{command.name}
            </Text>
            {command.kind === CommandKind.MCP_PROMPT && (
              <Text color={theme.text.secondary}> [MCP]</Text>
            )}
            {command.description && ' - ' + command.description}
          </Text>
          {command.subCommands &&
            command.subCommands
              .filter((subCommand) => !subCommand.hidden)
              .map((subCommand) => (
                <Text key={subCommand.name} color={theme.text.primary}>
                  <Text bold color={theme.text.accent}>
                    {'   '}
                    {subCommand.name}
                  </Text>
                  {subCommand.description && ' - ' + subCommand.description}
                </Text>
              ))}
        </Box>
      ))}
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        {' '}
        !{' '}
      </Text>
      {strings.help.shellCommandDesc}
    </Text>
    <Text color={theme.text.primary}>
      <Text color={theme.text.secondary}>[MCP]</Text>{' '}
      {strings.help.mcpCommandDesc}
    </Text>

    <Box height={1} />

    {/* Shortcuts */}
    <Text bold color={theme.text.primary}>
      {strings.help.shortcuts}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        Alt+Left/Right
      </Text>{' '}
      {strings.help.shortcutJumpWords}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        Ctrl+C
      </Text>{' '}
      {strings.help.shortcutQuit}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        {process.platform === 'win32' ? 'Ctrl+Enter' : 'Ctrl+J'}
      </Text>{' '}
      {process.platform === 'linux'
        ? strings.help.shortcutNewLineLinux
        : strings.help.shortcutNewLine}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        Ctrl+L
      </Text>{' '}
      {strings.help.shortcutClearScreen}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        Ctrl+S
      </Text>{' '}
      {strings.help.shortcutSelectionMode}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        {process.platform === 'darwin' ? 'Ctrl+X / Meta+Enter' : 'Ctrl+X'}
      </Text>{' '}
      {strings.help.shortcutExternalEditor}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        Ctrl+Y
      </Text>{' '}
      {strings.help.shortcutYoloMode}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        Enter
      </Text>{' '}
      {strings.help.shortcutSendMessage}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        Esc
      </Text>{' '}
      {strings.help.shortcutCancel}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        Page Up/Down
      </Text>{' '}
      {strings.help.shortcutScroll}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        Shift+Tab
      </Text>{' '}
      {strings.help.shortcutAutoAccept}
    </Text>
    <Text color={theme.text.primary}>
      <Text bold color={theme.text.accent}>
        Up/Down
      </Text>{' '}
      {strings.help.shortcutHistory}
    </Text>
    <Box height={1} />
    <Text color={theme.text.primary}>{strings.help.fullListLink}</Text>
  </Box>
);
