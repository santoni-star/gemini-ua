/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { render } from '../../test-utils/render.js';
import { ExitWarning } from './ExitWarning.js';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUIState, type UIState } from '../contexts/UIStateContext.js';

vi.mock('../contexts/UIStateContext.js');

describe('ExitWarning', () => {
  const mockUseUIState = vi.mocked(useUIState);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing by default', () => {
    mockUseUIState.mockReturnValue({
      dialogsVisible: false,
      ctrlCPressedOnce: false,
      ctrlDPressedOnce: false,
    } as unknown as UIState);
    const { lastFrame } = render(<ExitWarning />);
    expect(lastFrame()).toBe('');
  });

  it('renders Ctrl+C warning when pressed once and dialogs visible', () => {
    mockUseUIState.mockReturnValue({
      dialogsVisible: true,
      ctrlCPressedOnce: true,
      ctrlDPressedOnce: false,
    } as unknown as UIState);
    const { lastFrame } = render(<ExitWarning />);
    expect(lastFrame()).toContain('Натисніть Ctrl+C ще раз, щоб вийти.');
  });

  it('renders Ctrl+D warning when pressed once and dialogs visible', () => {
    mockUseUIState({
      ctrlDPressedOnce: true,
      isAnyDialogOpen: true,
    } as unknown as UIState);
    const { lastFrame } = render(<ExitWarning />);
    expect(lastFrame()).toContain('Натисніть Ctrl+D ще раз, щоб вийти.');
  });

  it('renders nothing if dialogs are not visible', () => {
    mockUseUIState.mockReturnValue({
      dialogsVisible: false,
      ctrlCPressedOnce: true,
      ctrlDPressedOnce: true,
    } as unknown as UIState);
    const { lastFrame } = render(<ExitWarning />);
    expect(lastFrame()).toBe('');
  });
});
