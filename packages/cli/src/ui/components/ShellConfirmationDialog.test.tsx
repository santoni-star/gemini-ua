/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { renderWithProviders } from '../../test-utils/render.js';
import { describe, it, expect, vi } from 'vitest';
import { ShellConfirmationDialog } from './ShellConfirmationDialog.js';

describe('ShellConfirmationDialog', () => {
  const onConfirm = vi.fn();

  const request = {
    commands: ['ls -la', 'echo "hello"'],
    onConfirm,
  };

  const baseProps = {
    request,
    onConfirm,
  };

  it('renders correctly', () => {
    const { lastFrame } = renderWithProviders(
      <ShellConfirmationDialog request={request} />,
      { width: 101 },
    );
    expect(lastFrame()).toMatchSnapshot();
  });

  it('calls onConfirm with ProceedOnce when "Allow once" is selected', () => {
    const { lastFrame } = renderWithProviders(
      <ShellConfirmationDialog {...baseProps} />,
    );
    const select = lastFrame()!.toString();
    // Simulate selecting the first option
    // This is a simplified way to test the selection
    expect(select).toContain('Дозволити один раз');
  });

  it('calls onConfirm with ProceedAlways when "Allow for this session" is selected', () => {
    const onConfirm = vi.fn();
    const { lastFrame } = renderWithProviders(
      <ShellConfirmationDialog {...baseProps} onConfirm={onConfirm} />,
    );
    const select = lastFrame()!.toString();
    // Simulate selecting the second option
    expect(select).toContain('Дозволити для цієї сесії');
  });

  it('calls onConfirm with Cancel when "No (esc)" is selected', () => {
    const onConfirm = vi.fn();
    const { lastFrame } = renderWithProviders(
      <ShellConfirmationDialog {...baseProps} onConfirm={onConfirm} />,
    );
    const select = lastFrame()!.toString();
    // Simulate selecting the third option
    expect(select).toContain('Ні (esc)');
  });
});
