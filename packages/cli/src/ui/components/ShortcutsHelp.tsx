/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { isNarrowWidth } from '../utils/isNarrowWidth.js';
import { SectionHeader } from './shared/SectionHeader.js';
import { useUIState } from '../contexts/UIStateContext.js';
import { strings } from '../../i18n.js';

type ShortcutItem = {
  key: string;
  description: string;
};

const buildShortcutItems = (): ShortcutItem[] => {
  const isMac = process.platform === 'darwin';
  const altLabel = isMac ? 'Option' : 'Alt';

  return [
    { key: '!', description: strings.shortcuts.shellMode },
    { key: '@', description: strings.shortcuts.selectFile },
    { key: 'Esc Esc', description: strings.shortcuts.clearRewind },
    { key: 'Tab Tab', description: strings.shortcuts.focusUi },
    { key: 'Ctrl+Y', description: strings.shortcuts.yoloMode },
    { key: 'Shift+Tab', description: strings.shortcuts.cycleMode },
    { key: 'Ctrl+V', description: strings.shortcuts.pasteImages },
    { key: `${altLabel}+M`, description: strings.shortcuts.rawMarkdown },
    { key: 'Ctrl+R', description: strings.shortcuts.reverseSearch },
    { key: 'Ctrl+X', description: strings.shortcuts.externalEditor },
  ];
};

const Shortcut: React.FC<{ item: ShortcutItem }> = ({ item }) => (
  <Box flexDirection="row">
    <Box flexShrink={0} marginRight={1}>
      <Text color={theme.text.accent}>{item.key}</Text>
    </Box>
    <Box flexGrow={1}>
      <Text color={theme.text.primary}>{item.description}</Text>
    </Box>
  </Box>
);

export const ShortcutsHelp: React.FC = () => {
  const { terminalWidth } = useUIState();
  const isNarrow = isNarrowWidth(terminalWidth);
  const items = buildShortcutItems();
  const itemsForDisplay = isNarrow
    ? items
    : [
        // Keep first column stable: !, @, Esc Esc, Tab Tab.
        items[0],
        items[5],
        items[6],
        items[1],
        items[4],
        items[7],
        items[2],
        items[8],
        items[9],
        items[3],
      ];

  return (
    <Box flexDirection="column" width="100%">
      <SectionHeader title={strings.shortcuts.title} />
      <Box flexDirection="row" flexWrap="wrap" paddingLeft={1} paddingRight={2}>
        {itemsForDisplay.map((item, index) => (
          <Box
            key={`${item.key}-${index}`}
            width={isNarrow ? '100%' : '33%'}
            paddingRight={isNarrow ? 0 : 2}
          >
            <Shortcut item={item} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
