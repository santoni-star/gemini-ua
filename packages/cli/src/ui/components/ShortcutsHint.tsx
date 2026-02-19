/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { useUIState } from '../contexts/UIStateContext.js';
import { strings } from '../../i18n.js';

export const ShortcutsHint: React.FC = () => {
  const { cleanUiDetailsVisible, shortcutsHelpVisible } = useUIState();

  if (!cleanUiDetailsVisible) {
    return <Text color={theme.text.secondary}> {strings.shortcutsHint.pressTabForMore} </Text>;
  }

  const highlightColor = shortcutsHelpVisible
    ? theme.text.accent
    : theme.text.secondary;

  return <Text color={highlightColor}> {strings.shortcutsHint.shortcutsHelp} </Text>;
};
