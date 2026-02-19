/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type {
  LoadableSettingScope,
  LoadedSettings,
} from '../config/settings.js';
import { isLoadableSettingScope, SettingScope } from '../config/settings.js';
import { settingExistsInScope } from './settingsUtils.js';
import { strings } from '../i18n.js';

/**
 * Shared scope labels for dialog components that need to display setting scopes
 */
export const SCOPE_LABELS = {
  [SettingScope.User]: strings.settingsScopeUser,
  [SettingScope.Workspace]: strings.settingsScopeWorkspace,
  [SettingScope.System]: strings.settingsScopeSystem,
} as const;

/**
 * Helper function to get scope items for radio button selects
 */
export function getScopeItems(): Array<{
  label: string;
  value: LoadableSettingScope;
}> {
  return [
    { label: SCOPE_LABELS[SettingScope.User], value: SettingScope.User },
    {
      label: SCOPE_LABELS[SettingScope.Workspace],
      value: SettingScope.Workspace,
    },
    { label: SCOPE_LABELS[SettingScope.System], value: SettingScope.System },
  ];
}

/**
 * Generate scope message for a specific setting
 */
export function getScopeMessageForSetting(
  settingKey: string,
  selectedScope: LoadableSettingScope,
  settings: LoadedSettings,
): string {
  const otherScopes = Object.values(SettingScope)
    .filter(isLoadableSettingScope)
    .filter((scope) => scope !== selectedScope);

  const modifiedInOtherScopes = otherScopes.filter((scope) => {
    const scopeSettings = settings.forScope(scope).settings;
    return settingExistsInScope(settingKey, scopeSettings);
  });

  if (modifiedInOtherScopes.length === 0) {
    return '';
  }

  const modifiedScopesStr = modifiedInOtherScopes
    .map((s) => SCOPE_LABELS[s])
    .join(', ');
  const currentScopeSettings = settings.forScope(selectedScope).settings;
  const existsInCurrentScope = settingExistsInScope(
    settingKey,
    currentScopeSettings,
  );

  return existsInCurrentScope
    ? strings.editorAlsoModifiedIn.replace('{scope}', modifiedScopesStr)
    : strings.editorModifiedIn.replace('{scope}', modifiedScopesStr);
}
