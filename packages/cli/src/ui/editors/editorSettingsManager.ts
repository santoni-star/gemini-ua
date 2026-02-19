/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  allowEditorTypeInSandbox,
  hasValidEditorCommand,
  type EditorType,
  EDITOR_DISPLAY_NAMES,
} from '@google/gemini-cli-core';
import { strings } from '../../i18n.js';

export interface EditorDisplay {
  name: string;
  type: EditorType | 'not_set';
  disabled: boolean;
}

class EditorSettingsManager {
  private readonly availableEditors: EditorDisplay[];

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const editorTypes = Object.keys(
      EDITOR_DISPLAY_NAMES,
    ).sort() as EditorType[];
    this.availableEditors = [
      {
        name: strings.editorNone,
        type: 'not_set',
        disabled: false,
      },
      ...editorTypes.map((type) => {
        const hasEditor = hasValidEditorCommand(type);
        const isAllowedInSandbox = allowEditorTypeInSandbox(type);

        let labelSuffix = !isAllowedInSandbox
          ? strings.editorNotAvailableInSandbox
          : '';
        labelSuffix = !hasEditor ? strings.editorNotInstalled : labelSuffix;

        return {
          name: EDITOR_DISPLAY_NAMES[type] + labelSuffix,
          type,
          disabled: !hasEditor || !isAllowedInSandbox,
        };
      }),
    ];
  }

  getAvailableEditorDisplays(): EditorDisplay[] {
    return this.availableEditors;
  }
}

export const editorSettingsManager = new EditorSettingsManager();
