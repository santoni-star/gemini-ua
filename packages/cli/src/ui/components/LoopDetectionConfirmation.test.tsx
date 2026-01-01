/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { renderWithProviders } from '../../test-utils/render.js';
import { describe, it, expect, vi } from 'vitest';
import { LoopDetectionConfirmation } from './LoopDetectionConfirmation.js';

describe('LoopDetectionConfirmation', () => {
  const onComplete = vi.fn();

  it('renders correctly', () => {
    const { lastFrame } = renderWithProviders(
      <LoopDetectionConfirmation onComplete={onComplete} />,
      { width: 101 },
    );
    expect(lastFrame()).toMatchSnapshot();
  });

  it('contains the expected options', () => {
    const { lastFrame } = renderWithProviders(
      <LoopDetectionConfirmation onComplete={onComplete} />,
      { width: 100 },
    );
    const output = lastFrame()!.toString();

    expect(output).toContain('Виявлено потенційне зациклення');
    expect(output).toContain('Залишити виявлення зациклення увімкненим (esc)');
    expect(output).toContain('Вимкнути виявлення зациклення для цієї сесії');
    expect(output).toContain(
      'This can happen due to repetitive tool calls or other model behavior',
    );
  });
});
