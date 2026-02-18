/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { type IdeContext, type MCPServerConfig } from '@google/gemini-cli-core';
import { useTerminalSize } from '../hooks/useTerminalSize.js';
import { isNarrowWidth } from '../utils/isNarrowWidth.js';
import { strings } from '../../i18n.js';

interface ContextSummaryDisplayProps {
  geminiMdFileCount: number;
  contextFileNames: string[];
  mcpServers?: Record<string, MCPServerConfig>;
  blockedMcpServers?: Array<{ name: string; extensionName: string }>;
  ideContext?: IdeContext;
  skillCount: number;
  backgroundProcessCount?: number;
}

export const ContextSummaryDisplay: React.FC<ContextSummaryDisplayProps> = ({
  geminiMdFileCount,
  contextFileNames,
  mcpServers,
  blockedMcpServers,
  ideContext,
  skillCount,
  backgroundProcessCount = 0,
}) => {
  const { columns: terminalWidth } = useTerminalSize();
  const isNarrow = isNarrowWidth(terminalWidth);
  const mcpServerCount = Object.keys(mcpServers || {}).length;
  const blockedMcpServerCount = blockedMcpServers?.length || 0;
  const openFileCount = ideContext?.workspaceState?.openFiles?.length ?? 0;

  if (
    geminiMdFileCount === 0 &&
    mcpServerCount === 0 &&
    blockedMcpServerCount === 0 &&
    openFileCount === 0 &&
    skillCount === 0 &&
    backgroundProcessCount === 0
  ) {
    return <Text> </Text>; // Render an empty space to reserve height
  }

  const openFilesText = (() => {
    if (openFileCount === 0) {
      return '';
    }
    const label =
      openFileCount === 1 ? strings.summaryOpenFile : strings.summaryOpenFiles;
    return `${openFileCount} ${label} ${strings.summaryCtrlG}`;
  })();

  const geminiMdText = (() => {
    if (geminiMdFileCount === 0) {
      return '';
    }
    const allNamesTheSame = new Set(contextFileNames).size < 2;
    const name = allNamesTheSame ? contextFileNames[0] : strings.summaryFile;
    const label =
      geminiMdFileCount === 1 ? strings.summaryFile : strings.summaryFiles;
    return `${geminiMdFileCount} ${name} ${label}`;
  })();

  const mcpText = (() => {
    if (mcpServerCount === 0 && blockedMcpServerCount === 0) {
      return '';
    }

    const parts = [];
    if (mcpServerCount > 0) {
      const label =
        mcpServerCount === 1
          ? strings.summaryMcpServer
          : strings.summaryMcpServers;
      parts.push(`${mcpServerCount} ${label}`);
    }

    if (blockedMcpServerCount > 0) {
      let blockedText = `${blockedMcpServerCount} ${strings.summaryBlocked}`;
      if (mcpServerCount === 0) {
        const label =
          blockedMcpServerCount === 1
            ? strings.summaryMcpServer
            : strings.summaryMcpServers;
        blockedText += ` ${label}`;
      }
      parts.push(blockedText);
    }
    return parts.join(', ');
  })();

  const skillText = (() => {
    if (skillCount === 0) {
      return '';
    }
    const label =
      skillCount === 1 ? strings.summarySkill : strings.summarySkills;
    return `${skillCount} ${label}`;
  })();

  const backgroundText = (() => {
    if (backgroundProcessCount === 0) {
      return '';
    }
    const label =
      backgroundProcessCount === 1
        ? strings.summaryBackgroundProcess
        : strings.summaryBackgroundProcesses;
    return `${backgroundProcessCount} ${label}`;
  })();

  const summaryParts = [
    openFilesText,
    geminiMdText,
    mcpText,
    skillText,
    backgroundText,
  ].filter(Boolean);

  if (isNarrow) {
    return (
      <Box flexDirection="column" paddingX={1}>
        {summaryParts.map((part, index) => (
          <Text key={index} color={theme.text.secondary}>
            - {part}
          </Text>
        ))}
      </Box>
    );
  }

  return (
    <Box paddingX={1}>
      <Text color={theme.text.secondary}>{summaryParts.join(' | ')}</Text>
    </Box>
  );
};
