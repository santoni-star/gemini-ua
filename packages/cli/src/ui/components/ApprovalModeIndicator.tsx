/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { ApprovalMode } from '@google/gemini-cli-core';
import { strings } from '../../i18n.js';

interface ApprovalModeIndicatorProps {
  approvalMode: ApprovalMode;
  allowPlanMode?: boolean;
}

export const ApprovalModeIndicator: React.FC<ApprovalModeIndicatorProps> = ({
  approvalMode,
  allowPlanMode,
}) => {
  let textColor = '';
  let textContent = '';
  let subText = '';

  switch (approvalMode) {
    case ApprovalMode.AUTO_EDIT:
      textColor = theme.status.warning;
      textContent = strings.indicatorAutoAcceptEdits;
      subText = allowPlanMode
        ? strings.indicatorHintPlan
        : strings.indicatorHintManual;
      break;
    case ApprovalMode.PLAN:
      textColor = theme.status.success;
      textContent = strings.indicatorPlan;
      subText = strings.indicatorHintManual;
      break;
    case ApprovalMode.YOLO:
      textColor = theme.status.error;
      textContent = strings.indicatorYolo;
      subText = strings.indicatorHintYolo;
      break;
    case ApprovalMode.DEFAULT:
    default:
      textColor = theme.text.accent;
      textContent = '';
      subText = strings.indicatorHintAutoEdit;
      break;
  }

  return (
    <Box>
      <Text color={textColor}>
        {textContent ? textContent : null}
        {subText ? (
          <Text color={theme.text.secondary}>
            {textContent ? ' ' : ''}
            {subText}
          </Text>
        ) : null}
      </Text>
    </Box>
  );
};
