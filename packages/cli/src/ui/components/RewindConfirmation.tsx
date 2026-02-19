/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Text } from 'ink';
import type React from 'react';
import { useMemo } from 'react';
import { theme } from '../semantic-colors.js';
import { RadioButtonSelect } from './shared/RadioButtonSelect.js';
import type { RadioSelectItem } from './shared/RadioButtonSelect.js';
import type { FileChangeStats } from '../utils/rewindFileOps.js';
import { useKeypress } from '../hooks/useKeypress.js';
import { formatTimeAgo } from '../utils/formatters.js';
import { keyMatchers, Command } from '../keyMatchers.js';
import { strings } from '../../i18n.js';

export enum RewindOutcome {
  RewindAndRevert = 'rewind_and_revert',
  RewindOnly = 'rewind_only',
  RevertOnly = 'revert_only',
  Cancel = 'cancel',
}

const getRewindOptions = (): Array<RadioSelectItem<RewindOutcome>> => [
  {
    label: strings.rewind.optionRewindAndRevert,
    value: RewindOutcome.RewindAndRevert,
    key: strings.rewind.optionRewindAndRevert,
  },
  {
    label: strings.rewind.optionRewindOnly,
    value: RewindOutcome.RewindOnly,
    key: strings.rewind.optionRewindOnly,
  },
  {
    label: strings.rewind.optionRevertOnly,
    value: RewindOutcome.RevertOnly,
    key: strings.rewind.optionRevertOnly,
  },
  {
    label: strings.rewind.optionDoNothing,
    value: RewindOutcome.Cancel,
    key: strings.rewind.optionDoNothing,
  },
];

interface RewindConfirmationProps {
  stats: FileChangeStats | null;
  onConfirm: (outcome: RewindOutcome) => void;
  terminalWidth: number;
  timestamp?: string;
}

export const RewindConfirmation: React.FC<RewindConfirmationProps> = ({
  stats,
  onConfirm,
  terminalWidth,
  timestamp,
}) => {
  useKeypress(
    (key) => {
      if (keyMatchers[Command.ESCAPE](key)) {
        onConfirm(RewindOutcome.Cancel);
        return true;
      }
      return false;
    },
    { isActive: true },
  );

  const handleSelect = (outcome: RewindOutcome) => {
    onConfirm(outcome);
  };

  const options = useMemo(() => {
    const allOptions = getRewindOptions();
    if (stats) {
      return allOptions;
    }
    return allOptions.filter(
      (option) =>
        option.value !== RewindOutcome.RewindAndRevert &&
        option.value !== RewindOutcome.RevertOnly,
    );
  }, [stats]);

  return (
    <Box
      flexDirection="column"
      borderStyle="round"
      borderColor={theme.border.default}
      padding={1}
      width={terminalWidth}
    >
      <Box marginBottom={1}>
        <Text bold>{strings.rewind.confirmTitle}</Text>
      </Box>

      {stats && (
        <Box
          flexDirection="column"
          marginBottom={1}
          borderStyle="single"
          borderColor={theme.border.default}
          paddingX={1}
        >
          <Text color={theme.text.primary}>
            {stats.fileCount === 1
              ? `${strings.summaryFile}: ${stats.details?.at(0)?.fileName}`
              : strings.rewind.filesAffected.replace('{count}', String(stats.fileCount))}
          </Text>
          <Box flexDirection="row">
            <Text color={theme.status.success}>
              {strings.rewind.linesAdded.replace('{count}', String(stats.addedLines))}{' '}
            </Text>
            <Text color={theme.status.error}>
              {strings.rewind.linesRemoved.replace('{count}', String(stats.removedLines))}
            </Text>
            {timestamp && (
              <Text color={theme.text.secondary}>
                {' '}
                ({formatTimeAgo(timestamp)})
              </Text>
            )}
          </Box>
          <Box marginTop={1}>
            <Text color={theme.status.warning}>
              ℹ {strings.rewind.warningManualEdits}
            </Text>
          </Box>
        </Box>
      )}

      {!stats && (
        <Box marginBottom={1}>
          <Text color={theme.text.secondary}>{strings.rewind.noChangesToRevert}</Text>
          {timestamp && (
            <Text color={theme.text.secondary}>
              {' '}
              ({formatTimeAgo(timestamp)})
            </Text>
          )}
        </Box>
      )}

      <Box marginBottom={1}>
        <Text>{strings.rewind.selectAction}</Text>
      </Box>

      <RadioButtonSelect
        items={options}
        onSelect={handleSelect}
        isFocused={true}
      />
    </Box>
  );
};
