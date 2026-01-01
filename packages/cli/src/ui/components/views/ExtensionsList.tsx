/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Box, Text } from 'ink';
import { useUIState } from '../../contexts/UIStateContext.js';
import { ExtensionUpdateState } from '../../state/extensions.js';
import { debugLogger, type GeminiCLIExtension } from '@google/gemini-cli-core';
import { strings } from '../../../i18n.js';

interface ExtensionsList {
  extensions: readonly GeminiCLIExtension[];
}

export const ExtensionsList: React.FC<ExtensionsList> = ({ extensions }) => {
  const { extensionsUpdateState } = useUIState();

  if (extensions.length === 0) {
    return <Text>{strings.extensionsListNoExtensions}</Text>;
  }

  return (
    <Box flexDirection="column" marginTop={1} marginBottom={1}>
      <Text>{strings.extensionsListInstalledTitle} </Text>
      <Box flexDirection="column" paddingLeft={2}>
        {extensions.map((ext) => {
          const state = extensionsUpdateState.get(ext.name);
          const isActive = ext.isActive;
          const activeString = isActive
            ? strings.extensionsListActive
            : strings.extensionsListDisabled;
          const activeColor = isActive ? 'green' : 'grey';

          let stateColor = 'gray';
          let stateText = strings.extensionsListUnknownState;

          if (state) {
            switch (state) {
              case ExtensionUpdateState.CHECKING_FOR_UPDATES:
                stateText = strings.extensionsListStatusChecking;
                stateColor = 'cyan';
                break;
              case ExtensionUpdateState.UPDATING:
                stateText = strings.extensionsListStatusUpdating;
                stateColor = 'cyan';
                break;
              case ExtensionUpdateState.UPDATE_AVAILABLE:
                stateText = strings.extensionsListStatusUpdateAvailable;
                stateColor = 'yellow';
                break;
              case ExtensionUpdateState.UPDATED_NEEDS_RESTART:
                stateText = strings.extensionsListStatusUpdatedRestart;
                stateColor = 'yellow';
                break;
              case ExtensionUpdateState.ERROR:
                stateText = strings.extensionsListStatusError;
                stateColor = 'red';
                break;
              case ExtensionUpdateState.UP_TO_DATE:
                stateText = strings.extensionsListStatusUpToDate;
                stateColor = 'green';
                break;
              case ExtensionUpdateState.NOT_UPDATABLE:
                stateText = strings.extensionsListStatusNotUpdatable;
                stateColor = 'green';
                break;
              case ExtensionUpdateState.UPDATED:
                stateText = strings.extensionsListStatusUpdated;
                stateColor = 'green';
                break;
              case ExtensionUpdateState.UNKNOWN:
                stateText = strings.extensionsListUnknownState;
                break;
              default:
                stateText = state;
                debugLogger.warn(`Unhandled ExtensionUpdateState ${state}`);
                break;
            }
          }

          return (
            <Box key={ext.name} flexDirection="column" marginBottom={1}>
              <Text>
                <Text color="cyan">{`${ext.name} (v${ext.version})`}</Text>
                <Text color={activeColor}>{` - ${activeString}`}</Text>
                {<Text color={stateColor}>{` (${stateText})`}</Text>}
              </Text>
              {ext.resolvedSettings && ext.resolvedSettings.length > 0 && (
                <Box flexDirection="column" paddingLeft={2}>
                  <Text>{strings.extensionsListSettings}</Text>
                  {ext.resolvedSettings.map((setting) => (
                    <Text key={setting.name}>
                      - {setting.name}: {setting.value}
                    </Text>
                  ))}
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
