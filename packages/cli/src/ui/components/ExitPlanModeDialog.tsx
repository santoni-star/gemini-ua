/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type React from 'react';
import { useEffect, useState } from 'react';
import { Box, Text } from 'ink';
import {
  ApprovalMode,
  validatePlanPath,
  validatePlanContent,
  QuestionType,
  type Config,
  processSingleFileContent,
} from '@google/gemini-cli-core';
import { theme } from '../semantic-colors.js';
import { useConfig } from '../contexts/ConfigContext.js';
import { AskUserDialog } from './AskUserDialog.js';

export interface ExitPlanModeDialogProps {
  planPath: string;
  onApprove: (approvalMode: ApprovalMode) => void;
  onFeedback: (feedback: string) => void;
  onCancel: () => void;
  width: number;
  availableHeight?: number;
}

enum PlanStatus {
  Loading = 'loading',
  Loaded = 'loaded',
  Error = 'error',
}

interface PlanContentState {
  status: PlanStatus;
  content?: string;
  error?: string;
}

enum ApprovalOption {
  Auto = 'Так, автоматично приймати зміни',
  Manual = 'Так, вручну приймати зміни',
}

/**
 * A tiny component for loading and error states with consistent styling.
 */
const StatusMessage: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => <Box paddingX={1}>{children}</Box>;

function usePlanContent(planPath: string, config: Config): PlanContentState {
  const [state, setState] = useState<PlanContentState>({
    status: PlanStatus.Loading,
  });

  useEffect(() => {
    let ignore = false;
    setState({ status: PlanStatus.Loading });

    const load = async () => {
      try {
        const pathError = await validatePlanPath(
          planPath,
          config.storage.getPlansDir(),
          config.getTargetDir(),
        );
        if (ignore) return;
        if (pathError) {
          setState({ status: PlanStatus.Error, error: pathError });
          return;
        }

        const contentError = await validatePlanContent(planPath);
        if (ignore) return;
        if (contentError) {
          setState({ status: PlanStatus.Error, error: contentError });
          return;
        }

        const result = await processSingleFileContent(
          planPath,
          config.storage.getPlansDir(),
          config.getFileSystemService(),
        );

        if (ignore) return;

        if (result.error) {
          setState({ status: PlanStatus.Error, error: result.error });
          return;
        }

        if (typeof result.llmContent !== 'string') {
          setState({
            status: PlanStatus.Error,
            error: 'Формат файлу плану не підтримується (бінарний або зображення).',
          });
          return;
        }

        const content = result.llmContent;
        if (!content) {
          setState({ status: PlanStatus.Error, error: 'Файл плану порожній.' });
          return;
        }
        setState({ status: PlanStatus.Loaded, content });
      } catch (err: unknown) {
        if (ignore) return;
        const errorMessage = err instanceof Error ? err.message : String(err);
        setState({ status: PlanStatus.Error, error: errorMessage });
      }
    };

    void load();

    return () => {
      ignore = true;
    };
  }, [planPath, config]);

  return state;
}

export const ExitPlanModeDialog: React.FC<ExitPlanModeDialogProps> = ({
  planPath,
  onApprove,
  onFeedback,
  onCancel,
  width,
  availableHeight,
}) => {
  const config = useConfig();
  const planState = usePlanContent(planPath, config);
  const [showLoading, setShowLoading] = useState(false);

  useEffect(() => {
    if (planState.status !== PlanStatus.Loading) {
      setShowLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowLoading(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [planState.status]);

  if (planState.status === PlanStatus.Loading) {
    if (!showLoading) {
      return null;
    }

    return (
      <StatusMessage>
        <Text color={theme.text.secondary} italic>
          Завантаження плану...
        </Text>
      </StatusMessage>
    );
  }

  if (planState.status === PlanStatus.Error) {
    return (
      <StatusMessage>
        <Text color={theme.status.error}>
          Помилка читання плану: {planState.error}
        </Text>
      </StatusMessage>
    );
  }

  const planContent = planState.content?.trim();
  if (!planContent) {
    return (
      <StatusMessage>
        <Text color={theme.status.error}>Помилка: Зміст плану порожній.</Text>
      </StatusMessage>
    );
  }

  return (
    <Box flexDirection="column" width={width}>
      <AskUserDialog
        questions={[
          {
            type: QuestionType.CHOICE,
            header: 'Підтвердження',
            question: planContent,
            options: [
              {
                label: ApprovalOption.Auto,
                description:
                  'Схвалює план і дозволяє інструментам працювати автоматично',
              },
              {
                label: ApprovalOption.Manual,
                description:
                  'Схвалює план, але потребує підтвердження для кожного інструменту',
              },
            ],
            placeholder: 'Введіть ваш відгук...',
            multiSelect: false,
          },
        ]}
        onSubmit={(answers) => {
          const answer = answers['0'];
          if (answer === ApprovalOption.Auto) {
            onApprove(ApprovalMode.AUTO_EDIT);
          } else if (answer === ApprovalOption.Manual) {
            onApprove(ApprovalMode.DEFAULT);
          } else if (answer) {
            onFeedback(answer);
          }
        }}
        onCancel={onCancel}
        width={width}
        availableHeight={availableHeight}
      />
    </Box>
  );
};
