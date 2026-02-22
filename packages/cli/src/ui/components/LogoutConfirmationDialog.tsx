/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Box, Text } from 'ink';
import type React from 'react';
import { theme } from '../semantic-colors.js';
import type { RadioSelectItem } from './shared/RadioButtonSelect.js';
import { RadioButtonSelect } from './shared/RadioButtonSelect.js';
import { useKeypress } from '../hooks/useKeypress.js';

export enum LogoutChoice {
  LOGIN = 'login',
  EXIT = 'exit',
}

interface LogoutConfirmationDialogProps {
  onSelect: (choice: LogoutChoice) => void;
}

export const LogoutConfirmationDialog: React.FC<
  LogoutConfirmationDialogProps
> = ({ onSelect }) => {
  // Handle escape key to exit (consistent with other dialogs)
  useKeypress(
    (key) => {
      if (key.name === 'escape') {
        onSelect(LogoutChoice.EXIT);
        return true;
      }
      return false;
    },
    { isActive: true },
  );

  const options: Array<RadioSelectItem<LogoutChoice>> = [
    {
      label: 'Увійти',
      value: LogoutChoice.LOGIN,
      key: 'login',
    },
    {
      label: 'Вийти',
      value: LogoutChoice.EXIT,
      key: 'exit',
    },
  ];

  return (
    <Box flexDirection="row" width="100%">
      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor={theme.border.focused}
        padding={1}
        flexGrow={1}
        marginLeft={1}
        marginRight={1}
      >
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color={theme.text.primary}>
            Ви вийшли з системи.
          </Text>
          <Text color={theme.text.secondary}>
            Увійдіть знову, щоб продовжити використання Gemini CLI, або вийдіть з програми.
          </Text>
        </Box>

        <RadioButtonSelect items={options} onSelect={onSelect} isFocused />

        <Box marginTop={1}>
          <Text color={theme.text.secondary}>
            (Використовуйте Enter для вибору, Esc для закриття)
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
