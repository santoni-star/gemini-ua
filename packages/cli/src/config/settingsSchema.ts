/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// --------------------------------------------------------------------------
// IMPORTANT: After adding or updating settings, run `npm run docs:settings`
// to regenerate the settings reference in `docs/get-started/configuration.md`.
// --------------------------------------------------------------------------

import {
  DEFAULT_TRUNCATE_TOOL_OUTPUT_THRESHOLD,
  DEFAULT_MODEL_CONFIGS,
  type MCPServerConfig,
  type BugCommandSettings,
  type TelemetrySettings,
  type AuthType,
  type AgentOverride,
  type CustomTheme,
} from '@google/gemini-cli-core';
import type { SessionRetentionSettings } from './settings.js';
import { DEFAULT_MIN_RETENTION } from '../utils/sessionCleanup.js';
import { getStrings } from '../i18n.js';

export type SettingsType =
  | 'boolean'
  | 'string'
  | 'number'
  | 'array'
  | 'object'
  | 'enum';

export type SettingsValue =
  | boolean
  | string
  | number
  | string[]
  | object
  | undefined;

/**
 * Setting datatypes that "toggle" through a fixed list of options
 * (e.g. an enum or true/false) rather than allowing for free form input
 * (like a number or string).
 */
export const TOGGLE_TYPES: ReadonlySet<SettingsType | undefined> = new Set([
  'boolean',
  'enum',
]);

export interface SettingEnumOption {
  value: string | number;
  label: string;
}

export interface SettingCollectionDefinition {
  type: SettingsType;
  description?: string;
  properties?: SettingsSchema;
  /** Enum type options  */
  options?: readonly SettingEnumOption[];
  /**
   * Optional reference identifier for generators that emit a `$ref`.
   * For example, a JSON schema generator can use this to point to a shared definition.
   */
  ref?: string;
  /**
   * Optional merge strategy for dynamically added properties.
   * Used when this collection definition is referenced via additionalProperties.
   */
  mergeStrategy?: MergeStrategy;
}

export enum MergeStrategy {
  // Replace the old value with the new value. This is the default.
  REPLACE = 'replace',
  // Concatenate arrays.
  CONCAT = 'concat',
  // Merge arrays, ensuring unique values.
  UNION = 'union',
  // Shallow merge objects.
  SHALLOW_MERGE = 'shallow_merge',
}

export interface SettingDefinition {
  type: SettingsType;
  label: string;
  category: string;
  requiresRestart: boolean;
  default: SettingsValue;
  description?: string;
  parentKey?: string;
  childKey?: string;
  key?: string;
  properties?: SettingsSchema;
  showInDialog?: boolean;
  ignoreInDocs?: boolean;
  mergeStrategy?: MergeStrategy;
  /** Enum type options  */
  options?: readonly SettingEnumOption[];
  /**
   * For collection types (e.g. arrays), describes the shape of each item.
   */
  items?: SettingCollectionDefinition;
  /**
   * For map-like objects without explicit `properties`, describes the shape of the values.
   */
  additionalProperties?: SettingCollectionDefinition;
  /**
   * Optional reference identifier for generators that emit a `$ref`.
   */
  ref?: string;
}

export interface SettingsSchema {
  [key: string]: SettingDefinition;
}

export type MemoryImportFormat = 'tree' | 'flat';
export type DnsResolutionOrder = 'ipv4first' | 'verbatim';

/**
 * The canonical schema for all settings.
 * The structure of this object defines the structure of the `Settings` type.
 * `as const` is crucial for TypeScript to infer the most specific types possible.
 */
const SETTINGS_SCHEMA = {
  // Maintained for compatibility/criticality
  mcpServers: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelMcpServers;
    },
    get category() { return getStrings().settingsLabelCategoryAdvanced; },
    requiresRestart: true as const,
    default: {} as Record<string, MCPServerConfig>,
    get description() {
      return getStrings().settingsDescMcpServers;
    },
    showInDialog: false as const,
    mergeStrategy: MergeStrategy.SHALLOW_MERGE,
    additionalProperties: {
      type: 'object' as const,
      ref: 'MCPServerConfig' as const,
    },
  },

  policyPaths: {
    type: 'array' as const,
    get label() {
      return getStrings().settingsLabelPolicyPaths;
    },
    get category() { return getStrings().settingsLabelCategoryAdvanced; },
    requiresRestart: true as const,
    default: [] as string[],
    get description() {
      return getStrings().settingsDescPolicyPaths;
    },
    showInDialog: false as const,
    items: { type: 'string' as const },
    mergeStrategy: MergeStrategy.UNION,
  },

  general: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelGeneral;
    },
    get category() { return getStrings().settingsLabelCategoryGeneral; },
    requiresRestart: false as const,
    default: {},
    get description() {
      return getStrings().settingsDescGeneral;
    },
    showInDialog: false as const,
    properties: {
      preferredEditor: {
        type: 'string' as const,
        get label() {
          return getStrings().settingsLabelPreferredEditor;
        },
        get category() { return getStrings().settingsLabelCategoryGeneral; },
        requiresRestart: false as const,
        default: undefined as string | undefined,
        get description() {
          return getStrings().settingsDescThePreferredEditorToOpenF;
        },
        showInDialog: false as const,
      },
      vimMode: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelVimMode;
        },
        get category() { return getStrings().settingsLabelCategoryGeneral; },
        requiresRestart: false as const,
        default: false,
        get description() {
          return getStrings().settingsDescEnableVimKeybindings;
        },
        showInDialog: true as const,
      },
      language: {
        type: 'enum' as const,
        get label() {
          return getStrings().settingsLabelLanguage;
        },
        get category() { return getStrings().settingsLabelCategoryGeneral; },
        requiresRestart: true as const,
        default: 'en',
        get description() {
          return getStrings().settingsDescTheLanguageForTheUi;
        },
        showInDialog: true as const,
        options: [
          {
            value: 'en' as const,
            get label() {
              return getStrings().settingsLabelEnglish;
            },
          },
          {
            value: 'ua' as const,
            get label() {
              return getStrings().settingsLabelUkrainian;
            },
          },
        ],
      },
      defaultApprovalMode: {
        type: 'enum' as const,
        get label() {
          return getStrings().settingsLabelDefaultApprovalMode;
        },
        get category() { return getStrings().settingsLabelCategoryGeneral; },
        requiresRestart: false as const,
        default: 'default' as const,
        get description() {
          return getStrings().settingsDescTheDefaultApprovalModeFor;
        },
        showInDialog: true as const,
        options: [
          {
            value: 'default' as const,
            get label() {
              return getStrings().settingsLabelDefault;
            },
          },
          {
            value: 'auto_edit' as const,
            get label() {
              return getStrings().settingsLabelAutoEdit;
            },
          },
          {
            value: 'plan' as const,
            get label() {
              return getStrings().settingsLabelPlan;
            },
          },
        ],
      },
      devtools: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelDevtools;
        },
        get category() { return getStrings().settingsLabelCategoryGeneral; },
        requiresRestart: false as const,
        default: false,
        get description() {
          return getStrings().settingsDescEnableDevtoolsInspectorOnL;
        },
        showInDialog: false as const,
      },
      enableAutoUpdate: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelEnableAutoUpdate;
        },
        get category() { return getStrings().settingsLabelCategoryGeneral; },
        requiresRestart: false as const,
        default: true,
        get description() {
          return getStrings().settingsDescEnableAutomaticUpdates;
        },
        showInDialog: true as const,
      },
      enableAutoUpdateNotification: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelEnableAutoUpdateNotification;
        },
        get category() { return getStrings().settingsLabelCategoryGeneral; },
        requiresRestart: false as const,
        default: true,
        get description() {
          return getStrings().settingsDescEnableUpdateNotificationPro;
        },
        showInDialog: false as const,
      },
      checkpointing: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelCheckpointing;
        },
        get category() { return getStrings().settingsLabelCategoryGeneral; },
        requiresRestart: true as const,
        default: {},
        get description() {
          return getStrings().settingsDescSessionCheckpointingSettings;
        },
        showInDialog: false as const,
        properties: {
          enabled: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelEnableCheckpointing;
            },
            get category() { return getStrings().settingsLabelCategoryGeneral; },
            requiresRestart: true as const,
            default: false,
            get description() {
              return getStrings().settingsDescEnableSessionCheckpointingF;
            },
            showInDialog: false as const,
          },
        },
      },
      enablePromptCompletion: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelEnablePromptCompletion;
        },
        get category() { return getStrings().settingsLabelCategoryGeneral; },
        requiresRestart: true as const,
        default: false,
        get description() {
          return getStrings().settingsDescEnablePromptCompletion;
        },
        showInDialog: true as const,
      },
      retryFetchErrors: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelRetryFetchErrors;
        },
        get category() { return getStrings().settingsLabelCategoryGeneral; },
        requiresRestart: false as const,
        default: false,
        get description() {
          return getStrings().settingsDescTheFormatToUseWhenImporti;
        },
        showInDialog: false as const,
      },
      debugKeystrokeLogging: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelDebugKeystrokeLogging;
        },
        get category() { return getStrings().settingsLabelCategoryGeneral; },
        requiresRestart: false as const,
        default: false,
        get description() {
          return getStrings().settingsDescEnableDebugLoggingOfKeystr;
        },
        showInDialog: true as const,
      },
      sessionRetention: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelSessionRetention;
        },
        get category() { return getStrings().settingsLabelCategoryGeneral; },
        requiresRestart: false as const,
        default: undefined as SessionRetentionSettings | undefined,
        showInDialog: false as const,
        properties: {
          enabled: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelEnableSessionCleanup;
            },
            get category() { return getStrings().settingsLabelCategoryGeneral; },
            requiresRestart: false as const,
            default: false,
            get description() {
              return getStrings().settingsDescEnableAutomaticSessionClean;
            },
            showInDialog: true as const,
          },
          maxAge: {
            type: 'string' as const,
            get label() {
              return getStrings().settingsLabelKeepChatHistory;
            },
            get category() { return getStrings().settingsLabelCategoryGeneral; },
            requiresRestart: false as const,
            default: undefined as string | undefined,
            get description() {
              return getStrings().settingsDescSettingsForAutomaticSession;
            },
            showInDialog: true as const,
          },
          maxCount: {
            type: 'number' as const,
            get label() {
              return getStrings().settingsLabelMaxSessionCount;
            },
            get category() { return getStrings().settingsLabelCategoryGeneral; },
            requiresRestart: false as const,
            default: undefined as number | undefined,
            get description() {
              return getStrings().settingsDescListOfDisabledExtensions;
            },
            showInDialog: false as const,
          },
          minRetention: {
            type: 'string' as const,
            get label() {
              return getStrings().settingsLabelMinRetentionPeriod;
            },
            get category() { return getStrings().settingsLabelCategoryGeneral; },
            requiresRestart: false as const,
            default: DEFAULT_MIN_RETENTION,
            get description() {
              return getStrings().settingsDescTimeoutInMillisecondsForHo;
            },
            showInDialog: false as const,
          },
          warningAcknowledged: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelWarningAcknowledged;
            },
            get category() { return getStrings().settingsLabelCategoryGeneral; },
            requiresRestart: false as const,
            default: false,
            showInDialog: false as const,
            get description() {
              return getStrings().settingsDescIfTrue;
            },
          },
        },
        get description() {
          return getStrings().settingsDescSettingsForAutomaticSession;
        },
      },
    },
  },
  output: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelOutput;
    },
    get category() { return getStrings().settingsLabelCategoryGeneral; },
    requiresRestart: false as const,
    default: {},
    get description() {
      return getStrings().settingsDescSettingsForTheCliOutput;
    },
    showInDialog: false as const,
    properties: {
      format: {
        type: 'enum' as const,
        get label() {
          return getStrings().settingsLabelOutputFormat;
        },
        get category() { return getStrings().settingsLabelCategoryGeneral; },
        requiresRestart: false as const,
        default: 'text' as const,
        get description() {
          return getStrings().settingsDescTheFormatOfTheCliOutput;
        },
        showInDialog: true as const,
        options: [
          {
            value: 'text' as const,
            get label() {
              return getStrings().settingsLabelText;
            },
          },
          {
            value: 'json' as const,
            get label() {
              return getStrings().settingsLabelJson;
            },
          },
        ],
      },
    },
  },

  ui: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelUi;
    },
    get category() { return getStrings().settingsLabelCategoryUI; },
    requiresRestart: false as const,
    default: {},
    get description() {
      return getStrings().settingsDescUserInterfaceSettings;
    },
    showInDialog: false as const,
    properties: {
      theme: {
        type: 'string' as const,
        get label() {
          return getStrings().settingsLabelTheme;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: undefined as string | undefined,
        get description() {
          return getStrings().settingsDescTheGeminiModelToUseForCo;
        },
        showInDialog: false as const,
      },
      autoThemeSwitching: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelAutoThemeSwitching;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: true,
        get description() {
          return getStrings().settingsDescAutomaticallyConfigureNode;
        },
        showInDialog: true as const,
      },
      terminalBackgroundPollingInterval: {
        type: 'number' as const,
        get label() {
          return getStrings().settingsLabelTerminalBackgroundPollingInterval;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: 60,
        get description() {
          return getStrings().settingsDescTimeoutInMillisecondsForMc;
        },
        showInDialog: true as const,
      },
      customThemes: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelCustomThemes;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: {} as Record<string, CustomTheme>,
        get description() {
          return getStrings().settingsDescCustomThemeDefinitions;
        },
        showInDialog: false as const,
        additionalProperties: {
          type: 'object' as const,
          ref: 'CustomTheme' as const,
        },
      },
      hideWindowTitle: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelHideWindowTitle;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: true as const,
        default: false,
        get description() {
          return getStrings().settingsDescHideTheWindowTitleBar;
        },
        showInDialog: true as const,
      },
      inlineThinkingMode: {
        type: 'enum' as const,
        get label() {
          return getStrings().settingsLabelInlineThinking;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: 'off' as const,
        get description() {
          return getStrings().settingsDescDisplayModelThinkingInline;
        },
        showInDialog: true as const,
        options: [
          {
            value: 'off' as const,
            get label() {
              return getStrings().settingsLabelOff;
            },
          },
          {
            value: 'full' as const,
            get label() {
              return getStrings().settingsLabelFull;
            },
          },
        ],
      },
      showStatusInTitle: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelShowThoughtsInTitle;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: false,
        get description() {
          return getStrings().settingsDescShowStatusInTitle;
        },
        showInDialog: true as const,
      },
      dynamicWindowTitle: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelDynamicWindowTitle;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: true,
        get description() {
          return getStrings().settingsDescDynamicWindowTitle;
        },
        showInDialog: true as const,
      },
      showHomeDirectoryWarning: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelShowHomeDirectoryWarning;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: true as const,
        default: true,
        get description() {
          return getStrings().settingsDescShowHomeDirectoryWarning;
        },
        showInDialog: true as const,
      },
      hideTips: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelHideTips;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: false,
        get description() {
          return getStrings().settingsDescHideHelpfulTipsInTheUi;
        },
        showInDialog: true as const,
      },
      showShortcutsHint: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelShowShortcutsHint;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: true,
        get description() {
          return getStrings().settingsDescShowShortcutsHint;
        },
        showInDialog: true as const,
      },
      hideBanner: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelHideBanner;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: false,
        get description() {
          return getStrings().settingsDescHideTheApplicationBanner;
        },
        showInDialog: true as const,
      },
      hideContextSummary: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelHideContextSummary;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: false,
        get description() {
          return getStrings().settingsDescHideContextSummary;
        },
        showInDialog: true as const,
      },
      footer: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelFooter;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: {},
        get description() {
          return getStrings().settingsDescSettingsForTheFooter;
        },
        showInDialog: false as const,
        properties: {
          hideCWD: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelHideCwd;
            },
            get category() { return getStrings().settingsLabelCategoryUI; },
            requiresRestart: false as const,
            default: false,
            get description() {
              return getStrings().settingsDescHideCWD;
            },
            showInDialog: true as const,
          },
          hideSandboxStatus: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelHideSandboxStatus;
            },
            get category() { return getStrings().settingsLabelCategoryUI; },
            requiresRestart: false as const,
            default: false,
            get description() {
              return getStrings().settingsDescHideTheSandboxStatusIndica;
            },
            showInDialog: true as const,
          },
          hideModelInfo: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelHideModelInfo;
            },
            get category() { return getStrings().settingsLabelCategoryUI; },
            requiresRestart: false as const,
            default: false,
            get description() {
              return getStrings().settingsDescHideTheModelNameAndContex;
            },
            showInDialog: true as const,
          },
          hideContextPercentage: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelHideContextWindowPercentage;
            },
            get category() { return getStrings().settingsLabelCategoryUI; },
            requiresRestart: false as const,
            default: true,
            get description() {
              return getStrings().settingsDescHidesTheContextWindowRemai;
            },
            showInDialog: true as const,
          },
        },
      },
      hideFooter: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelHideFooter;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: false,
        get description() {
          return getStrings().settingsDescHideTheFooterFromTheUi;
        },
        showInDialog: true as const,
      },
      showMemoryUsage: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelShowMemoryUsage;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: false,
        get description() {
          return getStrings().settingsDescDisplayMemoryUsageInformati;
        },
        showInDialog: true as const,
      },
      showLineNumbers: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelShowLineNumbers;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: true,
        get description() {
          return getStrings().settingsDescShowLineNumbersInTheChat;
        },
        showInDialog: true as const,
      },
      showCitations: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelShowCitations;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: false,
        get description() {
          return getStrings().settingsDescShowCitationsForGeneratedT;
        },
        showInDialog: true as const,
      },
      showModelInfoInChat: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelShowModelInfoInChat;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: false,
        get description() {
          return getStrings().settingsDescShowTheModelNameInTheCha;
        },
        showInDialog: true as const,
      },
      showUserIdentity: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelShowUserIdentity;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: true,
        get description() {
          return getStrings().settingsDescShowUserIdentity;
        },
        showInDialog: true as const,
      },
      useAlternateBuffer: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelUseAlternateScreenBuffer;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: true as const,
        default: false,
        get description() {
          return getStrings().settingsDescUseNodePtyForAnInteractiv;
        },
        showInDialog: true as const,
      },
      useBackgroundColor: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelUseBackgroundColor;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: true,
        get description() {
          return getStrings().settingsDescWhetherToUseBackgroundColo;
        },
        showInDialog: true as const,
      },
      incrementalRendering: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelIncrementalRendering;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: true as const,
        default: true,
        get description() {
          return getStrings().settingsDescEnablesToolOutputMaskingTo;
        },
        showInDialog: true as const,
      },
      showSpinner: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelShowSpinner;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: true,
        get description() {
          return getStrings().settingsDescShowTheSpinnerDuringOperat;
        },
        showInDialog: true as const,
      },
      customWittyPhrases: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelCustomWittyPhrases;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: false as const,
        default: [] as string[],
        get description() {
          return getStrings().settingsDescCustomWittyPhrasesToDispla;
        },
        showInDialog: false as const,
        items: { type: 'string' as const },
      },
      accessibility: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelAccessibility;
        },
        get category() { return getStrings().settingsLabelCategoryUI; },
        requiresRestart: true as const,
        default: {},
        get description() {
          return getStrings().settingsDescAccessibilitySettings;
        },
        showInDialog: false as const,
        properties: {
          enableLoadingPhrases: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelEnableLoadingPhrases;
            },
            get category() { return getStrings().settingsLabelCategoryUI; },
            requiresRestart: true as const,
            default: true,
            get description() {
              return getStrings().settingsDescEnableLoadingPhrasesDuring;
            },
            showInDialog: true as const,
          },
          screenReader: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelScreenReaderMode;
            },
            get category() { return getStrings().settingsLabelCategoryUI; },
            requiresRestart: true as const,
            default: false,
            get description() {
              return getStrings().settingsDescDisplayMemoryUsageInformati;
            },
            showInDialog: true as const,
          },
        },
      },
    },
  },

  ide: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelIde;
    },
    category: 'IDE' as const,
    requiresRestart: true as const,
    default: {},
    get description() {
      return getStrings().settingsDescIdeIntegrationSettings;
    },
    showInDialog: false as const,
    properties: {
      enabled: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelIdeMode;
        },
        category: 'IDE' as const,
        requiresRestart: true as const,
        default: false,
        get description() {
          return getStrings().settingsDescEnableIdeIntegrationMode;
        },
        showInDialog: true as const,
      },
      hasSeenNudge: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelHasSeenIdeIntegrationNudge;
        },
        category: 'IDE' as const,
        requiresRestart: false as const,
        default: false,
        get description() {
          return getStrings().settingsDescWhetherTheUserHasSeenThe;
        },
        showInDialog: false as const,
      },
    },
  },

  privacy: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelPrivacy;
    },
    category: 'Privacy' as const,
    requiresRestart: true as const,
    default: {},
    get description() {
      return getStrings().settingsDescPrivacyRelatedSettings;
    },
    showInDialog: false as const,
    properties: {
      usageStatisticsEnabled: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelEnableUsageStatistics;
        },
        category: 'Privacy' as const,
        requiresRestart: true as const,
        default: true,
        get description() {
          return getStrings().settingsDescEnableCollectionOfUsageSta;
        },
        showInDialog: false as const,
      },
    },
  },

  telemetry: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelTelemetry;
    },
    get category() { return getStrings().settingsLabelCategoryAdvanced; },
    requiresRestart: true as const,
    default: undefined as TelemetrySettings | undefined,
    get description() {
      return getStrings().settingsDescTelemetryConfiguration;
    },
    showInDialog: false as const,
    ref: 'TelemetrySettings' as const,
  },

  model: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelModel;
    },
    get category() { return getStrings().settingsLabelCategoryModel; },
    requiresRestart: false as const,
    default: {},
    get description() {
      return getStrings().settingsDescSettingsRelatedToTheGenera;
    },
    showInDialog: false as const,
    properties: {
      name: {
        type: 'string' as const,
        get label() {
          return getStrings().settingsLabelModelName;
        },
        get category() { return getStrings().settingsLabelCategoryModel; },
        requiresRestart: false as const,
        default: undefined as string | undefined,
        get description() {
          return getStrings().settingsDescTheGeminiModelToUseForCo;
        },
        showInDialog: false as const,
      },
      maxSessionTurns: {
        type: 'number' as const,
        get label() {
          return getStrings().settingsLabelMaxSessionTurns;
        },
        get category() { return getStrings().settingsLabelCategoryModel; },
        requiresRestart: false as const,
        default: -1,
        get description() {
          return getStrings().settingsDescTheMaximumNumberOfConversa;
        },
        showInDialog: true as const,
      },
      summarizeToolOutput: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelSummarizeToolOutput;
        },
        get category() { return getStrings().settingsLabelCategoryModel; },
        requiresRestart: false as const,
        default: undefined as
          | Record<string, { tokenBudget?: number }>
          | undefined,
        get description() {
          return getStrings().settingsDescEnablesOrDisablesSummarizat;
        },
        showInDialog: false as const,
        additionalProperties: {
          type: 'object' as const,
          get description() {
            return getStrings().settingsDescIndividualHookConfiguration;
          },
          ref: 'SummarizeToolOutputSettings' as const,
        },
      },
      compressionThreshold: {
        type: 'number' as const,
        get label() {
          return getStrings().settingsLabelCompressionThreshold;
        },
        get category() { return getStrings().settingsLabelCategoryModel; },
        requiresRestart: true as const,
        default: 0.5 as number,
        get description() {
          return getStrings().settingsDescTheFormatToUseWhenImporti;
        },
        showInDialog: true as const,
      },
      disableLoopDetection: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelDisableLoopDetection;
        },
        get category() { return getStrings().settingsLabelCategoryModel; },
        requiresRestart: true as const,
        default: false,
        get description() {
          return getStrings().settingsDescDisableLlmBasedErrorCorrec;
        },
        showInDialog: true as const,
      },
      skipNextSpeakerCheck: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelSkipNextSpeakerCheck;
        },
        get category() { return getStrings().settingsLabelCategoryModel; },
        requiresRestart: false as const,
        default: true,
        get description() {
          return getStrings().settingsDescSkipTheNextSpeakerCheck;
        },
        showInDialog: true as const,
      },
    },
  },

  modelConfigs: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelModelConfigs;
    },
    get category() { return getStrings().settingsLabelCategoryModel; },
    requiresRestart: false as const,
    default: DEFAULT_MODEL_CONFIGS,
    get description() {
      return getStrings().settingsDescModelConfigurations;
    },
    showInDialog: false as const,
    properties: {
      aliases: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelModelConfigAliases;
        },
        get category() { return getStrings().settingsLabelCategoryModel; },
        requiresRestart: false as const,
        default: DEFAULT_MODEL_CONFIGS.aliases,
        get description() {
          return getStrings().settingsDescModelConfigurations;
        },
        showInDialog: false as const,
      },
      customAliases: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelCustomModelConfigAliases;
        },
        get category() { return getStrings().settingsLabelCategoryModel; },
        requiresRestart: false as const,
        default: {},
        get description() {
          return getStrings().settingsDescModelConfigurations;
        },
        showInDialog: false as const,
      },
      customOverrides: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelCustomModelConfigOverrides;
        },
        get category() { return getStrings().settingsLabelCategoryModel; },
        requiresRestart: false as const,
        default: [],
        get description() {
          return getStrings().settingsDescModelConfigurations;
        },
        showInDialog: false as const,
      },
      overrides: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelModelConfigOverrides;
        },
        get category() { return getStrings().settingsLabelCategoryModel; },
        requiresRestart: false as const,
        default: [],
        get description() {
          return getStrings().settingsDescModelConfigurations;
        },
        showInDialog: false as const,
      },
    },
  },

  agents: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelAgents;
    },
    get category() { return getStrings().settingsLabelCategoryAdvanced; },
    requiresRestart: true as const,
    default: {},
    get description() {
      return getStrings().settingsDescSettingsForSubagents;
    },
    showInDialog: false as const,
    properties: {
      overrides: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelAgentOverrides;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: true as const,
        default: {} as Record<string, AgentOverride>,
        get description() {
          return getStrings().settingsDescOverrideSettingsForASpecif;
        },
        showInDialog: false as const,
        additionalProperties: {
          type: 'object' as const,
          ref: 'AgentOverride' as const,
        },
      },
    },
  },

  context: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelContext;
    },
    get category() { return getStrings().settingsLabelCategoryContext; },
    requiresRestart: false as const,
    default: {},
    get description() {
      return getStrings().settingsDescSettingsForManagingContext;
    },
    showInDialog: false as const,
    properties: {
      fileName: {
        type: 'string' as const,
        get label() {
          return getStrings().settingsLabelContextFileName;
        },
        get category() { return getStrings().settingsLabelCategoryContext; },
        requiresRestart: false as const,
        default: undefined as string | string[] | undefined,
        ref: 'StringOrStringArray' as const,
        get description() {
          return getStrings().settingsDescSettingsForManagingContext;
        },
        showInDialog: false as const,
      },
      importFormat: {
        type: 'string' as const,
        get label() {
          return getStrings().settingsLabelMemoryImportFormat;
        },
        get category() { return getStrings().settingsLabelCategoryContext; },
        requiresRestart: false as const,
        default: undefined as MemoryImportFormat | undefined,
        get description() {
          return getStrings().settingsDescTheFormatToUseWhenImporti;
        },
        showInDialog: false as const,
      },
      includeDirectoryTree: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelIncludeDirectoryTree;
        },
        get category() { return getStrings().settingsLabelCategoryContext; },
        requiresRestart: false as const,
        default: true,
        get description() {
          return getStrings().settingsDescDisplayModelThinkingInline;
        },
        showInDialog: false as const,
      },
      discoveryMaxDirs: {
        type: 'number' as const,
        get label() {
          return getStrings().settingsLabelDiscoveryMaxDirs;
        },
        get category() { return getStrings().settingsLabelCategoryContext; },
        requiresRestart: false as const,
        default: 200,
        get description() {
          return getStrings().settingsDescMaximumNumberOfDirectories;
        },
        showInDialog: true as const,
      },
      includeDirectories: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelIncludeDirectories;
        },
        get category() { return getStrings().settingsLabelCategoryContext; },
        requiresRestart: false as const,
        default: [] as string[],
        get description() {
          return getStrings().settingsDescAdditionalDirectoriesToIncl;
        },
        showInDialog: false as const,
        items: { type: 'string' as const },
        mergeStrategy: MergeStrategy.CONCAT,
      },
      loadMemoryFromIncludeDirectories: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelLoadMemoryFromIncludeDirectories;
        },
        get category() { return getStrings().settingsLabelCategoryContext; },
        requiresRestart: false as const,
        default: false,
        get description() {
          return getStrings().settingsDescControlsHowMemoryRefreshL;
        },
        showInDialog: true as const,
      },
      fileFiltering: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelFileFiltering;
        },
        get category() { return getStrings().settingsLabelCategoryContext; },
        requiresRestart: true as const,
        default: {},
        get description() {
          return getStrings().settingsDescSettingsForGitAwareFileFi;
        },
        showInDialog: false as const,
        properties: {
          respectGitIgnore: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelRespectGitignore;
            },
            get category() { return getStrings().settingsLabelCategoryContext; },
            requiresRestart: true as const,
            default: true,
            get description() {
              return getStrings().settingsDescRespect;
            },
            showInDialog: true as const,
          },
          respectGeminiIgnore: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelRespectGeminiignore;
            },
            get category() { return getStrings().settingsLabelCategoryContext; },
            requiresRestart: true as const,
            default: true,
            get description() {
              return getStrings().settingsDescRespect;
            },
            showInDialog: true as const,
          },
          enableRecursiveFileSearch: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelEnableRecursiveFileSearch;
            },
            get category() { return getStrings().settingsLabelCategoryContext; },
            requiresRestart: true as const,
            default: true,
            get description() {
              return getStrings().settingsDescEnableRecursiveFileSearchF;
            },
            showInDialog: true as const,
          },
          enableFuzzySearch: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelEnableFuzzySearch;
            },
            get category() { return getStrings().settingsLabelCategoryContext; },
            requiresRestart: true as const,
            default: true,
            get description() {
              return getStrings().settingsDescEnableFuzzySearchWhenSearc;
            },
            showInDialog: true as const,
          },
          customIgnoreFilePaths: {
            type: 'array' as const,
            get label() {
              return getStrings().settingsLabelCustomIgnoreFilePaths;
            },
            get category() { return getStrings().settingsLabelCategoryContext; },
            requiresRestart: true as const,
            default: [] as string[],
            get description() {
              return getStrings().settingsDescTheFormatToUseWhenImporti;
            },
            showInDialog: true as const,
            items: { type: 'string' as const },
            mergeStrategy: MergeStrategy.UNION,
          },
        },
      },
    },
  },

  tools: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelTools;
    },
    get category() { return getStrings().settingsLabelCategoryTools; },
    requiresRestart: true as const,
    default: {},
    get description() {
      return getStrings().settingsDescSettingsForBuiltInAndCust;
    },
    showInDialog: false as const,
    properties: {
      sandbox: {
        type: 'string' as const,
        get label() {
          return getStrings().settingsLabelSandbox;
        },
        get category() { return getStrings().settingsLabelCategoryTools; },
        requiresRestart: true as const,
        default: undefined as boolean | string | undefined,
        ref: 'BooleanOrString' as const,
        get description() {
          return getStrings().settingsDescSandboxExecutionEnvironment;
        },
        showInDialog: false as const,
      },
      shell: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelShell;
        },
        get category() { return getStrings().settingsLabelCategoryTools; },
        requiresRestart: false as const,
        default: {},
        get description() {
          return getStrings().settingsDescSettingsForShellExecution;
        },
        showInDialog: false as const,
        properties: {
          enableInteractiveShell: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelEnableInteractiveShell;
            },
            get category() { return getStrings().settingsLabelCategoryTools; },
            requiresRestart: true as const,
            default: true,
            get description() {
              return getStrings().settingsDescUseNodePtyForAnInteractiv;
            },
            showInDialog: true as const,
          },
          pager: {
            type: 'string' as const,
            get label() {
              return getStrings().settingsLabelPager;
            },
            get category() { return getStrings().settingsLabelCategoryTools; },
            requiresRestart: false as const,
            default: 'cat' as string | undefined,
            get description() {
              return getStrings().settingsDescTheFormatToUseWhenImporti;
            },
            showInDialog: false as const,
          },
          showColor: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelShowColor;
            },
            get category() { return getStrings().settingsLabelCategoryTools; },
            requiresRestart: false as const,
            default: false,
            get description() {
              return getStrings().settingsDescShowColorInShellOutput;
            },
            showInDialog: true as const,
          },
          inactivityTimeout: {
            type: 'number' as const,
            get label() {
              return getStrings().settingsLabelInactivityTimeout;
            },
            get category() { return getStrings().settingsLabelCategoryTools; },
            requiresRestart: false as const,
            default: 300,
            get description() {
              return getStrings().settingsDescTimeoutInMillisecondsForMc;
            },
            showInDialog: false as const,
          },
          enableShellOutputEfficiency: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelEnableShellOutputEfficiency;
            },
            get category() { return getStrings().settingsLabelCategoryTools; },
            requiresRestart: false as const,
            default: true,
            get description() {
              return getStrings().settingsDescEnablesToolOutputMaskingTo;
            },
            showInDialog: false as const,
          },
        },
      },

      core: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelCoreTools;
        },
        get category() { return getStrings().settingsLabelCategoryTools; },
        requiresRestart: true as const,
        default: undefined as string[] | undefined,
        get description() {
          return getStrings().settingsDescRestrictTheSetOfBuiltInT;
        },
        showInDialog: false as const,
        items: { type: 'string' as const },
      },
      allowed: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelAllowedTools;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: true as const,
        default: undefined as string[] | undefined,
        get description() {
          return getStrings().settingsDescToolNamesThatBypassTheCon;
        },
        showInDialog: false as const,
        items: { type: 'string' as const },
      },
      exclude: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelExcludeTools;
        },
        get category() { return getStrings().settingsLabelCategoryTools; },
        requiresRestart: true as const,
        default: undefined as string[] | undefined,
        get description() {
          return getStrings().settingsDescToolNamesToExcludeFromDis;
        },
        showInDialog: false as const,
        items: { type: 'string' as const },
        mergeStrategy: MergeStrategy.UNION,
      },
      discoveryCommand: {
        type: 'string' as const,
        get label() {
          return getStrings().settingsLabelToolDiscoveryCommand;
        },
        get category() { return getStrings().settingsLabelCategoryTools; },
        requiresRestart: true as const,
        default: undefined as string | undefined,
        get description() {
          return getStrings().settingsDescCommandToRunForToolDiscov;
        },
        showInDialog: false as const,
      },
      callCommand: {
        type: 'string' as const,
        get label() {
          return getStrings().settingsLabelToolCallCommand;
        },
        get category() { return getStrings().settingsLabelCategoryTools; },
        requiresRestart: true as const,
        default: undefined as string | undefined,
        get description() {
          return getStrings().settingsDescDefinesACustomShellCommand;
        },
        showInDialog: false as const,
      },
      useRipgrep: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelUseRipgrep;
        },
        get category() { return getStrings().settingsLabelCategoryTools; },
        requiresRestart: false as const,
        default: true,
        get description() {
          return getStrings().settingsDescEnableFuzzySearchWhenSearc;
        },
        showInDialog: true as const,
      },
      truncateToolOutputThreshold: {
        type: 'number' as const,
        get label() {
          return getStrings().settingsLabelTruncateToolOutputThreshold;
        },
        get category() { return getStrings().settingsLabelCategoryGeneral; },
        requiresRestart: true as const,
        default: DEFAULT_TRUNCATE_TOOL_OUTPUT_THRESHOLD,
        get description() {
          return getStrings().settingsDescTheFormatToUseWhenImporti;
        },
        showInDialog: true as const,
      },
      disableLLMCorrection: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelDisableLlmCorrection;
        },
        get category() { return getStrings().settingsLabelCategoryTools; },
        requiresRestart: true as const,
        default: true,
        get description() {
          return getStrings().settingsDescDisableLlmBasedErrorCorrec;
        },
        showInDialog: true as const,
      },
    },
  },

  mcp: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelMcp;
    },
    get category() { return getStrings().settingsLabelCategoryMCP; },
    requiresRestart: true as const,
    default: {},
    get description() {
      return getStrings().settingsDescSettingsForModelContextPro;
    },
    showInDialog: false as const,
    properties: {
      serverCommand: {
        type: 'string' as const,
        get label() {
          return getStrings().settingsLabelMcpServerCommand;
        },
        get category() { return getStrings().settingsLabelCategoryMCP; },
        requiresRestart: true as const,
        default: undefined as string | undefined,
        get description() {
          return getStrings().settingsDescCommandToStartAnMcpServer;
        },
        showInDialog: false as const,
      },
      allowed: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelAllowMcpServers;
        },
        get category() { return getStrings().settingsLabelCategoryMCP; },
        requiresRestart: true as const,
        default: undefined as string[] | undefined,
        get description() {
          return getStrings().settingsDescAListOfMcpServersToAllow;
        },
        showInDialog: false as const,
        items: { type: 'string' as const },
      },
      excluded: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelExcludeMcpServers;
        },
        get category() { return getStrings().settingsLabelCategoryMCP; },
        requiresRestart: true as const,
        default: undefined as string[] | undefined,
        get description() {
          return getStrings().settingsDescAListOfMcpServersToExclu;
        },
        showInDialog: false as const,
        items: { type: 'string' as const },
      },
    },
  },
  useWriteTodos: {
    type: 'boolean' as const,
    get label() {
      return getStrings().settingsLabelUseWritetodos;
    },
    get category() { return getStrings().settingsLabelCategoryAdvanced; },
    requiresRestart: false as const,
    default: true,
    get description() {
      return getStrings().settingsDescEnableTheWriteTodosTool;
    },
    showInDialog: false as const,
  },
  security: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelSecurity;
    },
    get category() { return getStrings().settingsLabelCategorySecurity; },
    requiresRestart: true as const,
    default: {},
    get description() {
      return getStrings().settingsDescSecurityRelatedSettings;
    },
    showInDialog: false as const,
    properties: {
      disableYoloMode: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelDisableYoloMode;
        },
        get category() { return getStrings().settingsLabelCategorySecurity; },
        requiresRestart: true as const,
        default: false,
        get description() {
          return getStrings().settingsDescDisableYoloMode;
        },
        showInDialog: true as const,
      },
      enablePermanentToolApproval: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelAllowPermanentToolApproval;
        },
        get category() { return getStrings().settingsLabelCategorySecurity; },
        requiresRestart: false as const,
        default: false,
        get description() {
          return getStrings().settingsDescToolNamesThatBypassTheCon;
        },
        showInDialog: true as const,
      },
      blockGitExtensions: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelBlocksExtensionsFromGit;
        },
        get category() { return getStrings().settingsLabelCategorySecurity; },
        requiresRestart: true as const,
        default: false,
        get description() {
          return getStrings().settingsDescBlocksInstallingAndLoading;
        },
        showInDialog: true as const,
      },
      allowedExtensions: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelAllowedExtensions;
        },
        get category() { return getStrings().settingsLabelCategorySecurity; },
        requiresRestart: true as const,
        default: [] as string[],
        get description() {
          return getStrings().settingsDescEnableExtensionManagementFe;
        },
        showInDialog: true as const,
        items: { type: 'string' as const },
      },
      folderTrust: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelFolderTrust;
        },
        get category() { return getStrings().settingsLabelCategorySecurity; },
        requiresRestart: false as const,
        default: {},
        get description() {
          return getStrings().settingsDescSettingsForFolderTrust;
        },
        showInDialog: false as const,
        properties: {
          enabled: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelFolderTrust;
            },
            get category() { return getStrings().settingsLabelCategorySecurity; },
            requiresRestart: true as const,
            default: true,
            get description() {
              return getStrings().settingsDescSettingToTrackWhetherFolde;
            },
            showInDialog: true as const,
          },
        },
      },
      environmentVariableRedaction: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelEnvironmentVariableRedaction;
        },
        get category() { return getStrings().settingsLabelCategorySecurity; },
        requiresRestart: false as const,
        default: {},
        get description() {
          return getStrings().settingsDescSettingsForEnvironmentVaria;
        },
        showInDialog: false as const,
        properties: {
          allowed: {
            type: 'array' as const,
            get label() {
              return getStrings().settingsLabelAllowedEnvironmentVariables;
            },
            get category() { return getStrings().settingsLabelCategorySecurity; },
            requiresRestart: true as const,
            default: [] as string[],
            get description() {
              return getStrings().settingsDescEnvironmentVariablesToAlway;
            },
            showInDialog: false as const,
            items: { type: 'string' as const },
          },
          blocked: {
            type: 'array' as const,
            get label() {
              return getStrings().settingsLabelBlockedEnvironmentVariables;
            },
            get category() { return getStrings().settingsLabelCategorySecurity; },
            requiresRestart: true as const,
            default: [] as string[],
            get description() {
              return getStrings().settingsDescEnvironmentVariablesToAlway;
            },
            showInDialog: false as const,
            items: { type: 'string' as const },
          },
          enabled: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelEnableEnvironmentVariableRedaction;
            },
            get category() { return getStrings().settingsLabelCategorySecurity; },
            requiresRestart: true as const,
            default: false,
            get description() {
              return getStrings().settingsDescEnableExtensionManagementFe;
            },
            showInDialog: true as const,
          },
        },
      },
      auth: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelAuth;
        },
        get category() { return getStrings().settingsLabelCategorySecurity; },
        requiresRestart: true as const,
        default: {},
        get description() {
          return getStrings().settingsDescAuthenticationSettings;
        },
        showInDialog: false as const,
        properties: {
          selectedType: {
            type: 'string' as const,
            get label() {
              return getStrings().settingsLabelSelectedAuthType;
            },
            get category() { return getStrings().settingsLabelCategorySecurity; },
            requiresRestart: true as const,
            default: undefined as AuthType | undefined,
            get description() {
              return getStrings().settingsDescTheCurrentlySelectedAuthent;
            },
            showInDialog: false as const,
          },
          enforcedType: {
            type: 'string' as const,
            get label() {
              return getStrings().settingsLabelEnforcedAuthType;
            },
            get category() { return getStrings().settingsLabelCategoryAdvanced; },
            requiresRestart: true as const,
            default: undefined as AuthType | undefined,
            get description() {
              return getStrings().settingsDescTheGeminiModelToUseForCo;
            },
            showInDialog: false as const,
          },
          useExternal: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelUseExternalAuth;
            },
            get category() { return getStrings().settingsLabelCategorySecurity; },
            requiresRestart: true as const,
            default: undefined as boolean | undefined,
            get description() {
              return getStrings().settingsDescWhetherToUseAnExternalAut;
            },
            showInDialog: false as const,
          },
        },
      },
    },
  },

  advanced: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelAdvanced;
    },
    get category() { return getStrings().settingsLabelCategoryAdvanced; },
    requiresRestart: true as const,
    default: {},
    get description() {
      return getStrings().settingsDescAdvancedSettingsForPowerUs;
    },
    showInDialog: false as const,
    properties: {
      autoConfigureMemory: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelAutoConfigureMaxOldSpaceSize;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: true as const,
        default: false,
        get description() {
          return getStrings().settingsDescAutomaticallyConfigureNode;
        },
        showInDialog: true as const,
      },
      dnsResolutionOrder: {
        type: 'string' as const,
        get label() {
          return getStrings().settingsLabelDnsResolutionOrder;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: true as const,
        default: undefined as DnsResolutionOrder | undefined,
        get description() {
          return getStrings().settingsDescTheDnsResolutionOrder;
        },
        showInDialog: false as const,
      },
      excludedEnvVars: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelExcludedProjectEnvironmentVariables;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: false as const,
        default: ['DEBUG', 'DEBUG_MODE'] as string[],
        get description() {
          return getStrings().settingsDescEnvironmentVariablesToExclu;
        },
        showInDialog: false as const,
        items: { type: 'string' as const },
        mergeStrategy: MergeStrategy.UNION,
      },
      bugCommand: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelBugCommand;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: false as const,
        default: undefined as BugCommandSettings | undefined,
        get description() {
          return getStrings().settingsDescConfigurationForTheBugRepo;
        },
        showInDialog: false as const,
        ref: 'BugCommandSettings' as const,
      },
    },
  },

  experimental: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelExperimental;
    },
    get category() { return getStrings().settingsLabelCategoryExperimental; },
    requiresRestart: true as const,
    default: {},
    get description() {
      return getStrings().settingsDescSettingToEnableExperimental;
    },
    showInDialog: false as const,
    properties: {
      toolOutputMasking: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelToolOutputMasking;
        },
        get category() { return getStrings().settingsLabelCategoryExperimental; },
        requiresRestart: true as const,
        ignoreInDocs: false,
        default: {},
        get description() {
          return getStrings().settingsDescEnablesToolOutputMaskingTo;
        },
        showInDialog: false as const,
        properties: {
          enabled: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelEnableToolOutputMasking;
            },
            get category() { return getStrings().settingsLabelCategoryExperimental; },
            requiresRestart: true as const,
            default: true,
            get description() {
              return getStrings().settingsDescEnablesToolOutputMaskingTo;
            },
            showInDialog: true as const,
          },
          toolProtectionThreshold: {
            type: 'number' as const,
            get label() {
              return getStrings().settingsLabelToolProtectionThreshold;
            },
            get category() { return getStrings().settingsLabelCategoryExperimental; },
            requiresRestart: true as const,
            default: 50000,
            get description() {
              return getStrings().settingsDescTimeoutInMillisecondsForMc;
            },
            showInDialog: false as const,
          },
          minPrunableTokensThreshold: {
            type: 'number' as const,
            get label() {
              return getStrings().settingsLabelMinPrunableTokensThreshold;
            },
            get category() { return getStrings().settingsLabelCategoryExperimental; },
            requiresRestart: true as const,
            default: 30000,
            get description() {
              return getStrings().settingsDescTimeoutInMillisecondsForMc;
            },
            showInDialog: false as const,
          },
          protectLatestTurn: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelProtectLatestTurn;
            },
            get category() { return getStrings().settingsLabelCategoryExperimental; },
            requiresRestart: true as const,
            default: true,
            get description() {
              return getStrings().settingsDescWhetherPromptsAreLoggedIn;
            },
            showInDialog: false as const,
          },
        },
      },
      enableAgents: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelEnableAgents;
        },
        get category() { return getStrings().settingsLabelCategoryExperimental; },
        requiresRestart: true as const,
        default: false,
        get description() {
          return getStrings().settingsDescEnableAgentSkills;
        },
        showInDialog: false as const,
      },
      extensionManagement: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelExtensionManagement;
        },
        get category() { return getStrings().settingsLabelCategoryExperimental; },
        requiresRestart: true as const,
        default: true,
        get description() {
          return getStrings().settingsDescEnableExtensionManagementFe;
        },
        showInDialog: false as const,
      },
      extensionConfig: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelExtensionConfiguration;
        },
        get category() { return getStrings().settingsLabelCategoryExperimental; },
        requiresRestart: true as const,
        default: true,
        get description() {
          return getStrings().settingsDescEnableRequestingAndFetching;
        },
        showInDialog: false as const,
      },
      extensionRegistry: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelExtensionRegistryExploreUi;
        },
        get category() { return getStrings().settingsLabelCategoryExperimental; },
        requiresRestart: true as const,
        default: false,
        get description() {
          return getStrings().settingsDescEnableExtensionRegistryExpl;
        },
        showInDialog: false as const,
      },
      extensionReloading: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelExtensionReloading;
        },
        get category() { return getStrings().settingsLabelCategoryExperimental; },
        requiresRestart: true as const,
        default: false,
        get description() {
          return getStrings().settingsDescEnableExtensionManagementFe;
        },
        showInDialog: false as const,
      },
      jitContext: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelJitContextLoading;
        },
        get category() { return getStrings().settingsLabelCategoryExperimental; },
        requiresRestart: true as const,
        default: false,
        get description() {
          return getStrings().settingsDescEnableJustInTime;
        },
        showInDialog: false as const,
      },
      useOSC52Paste: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelUseOsc52Paste;
        },
        get category() { return getStrings().settingsLabelCategoryExperimental; },
        requiresRestart: false as const,
        default: false,
        get description() {
          return getStrings().settingsDescWhetherToUseAnExternalAut;
        },
        showInDialog: true as const,
      },
      plan: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelPlan;
        },
        get category() { return getStrings().settingsLabelCategoryExperimental; },
        requiresRestart: true as const,
        default: false,
        get description() {
          return getStrings().settingsDescEnablePlanningFeatures;
        },
        showInDialog: true as const,
      },
    },
  },

  extensions: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelExtensions;
    },
    get category() { return getStrings().settingsLabelCategoryExtensions; },
    requiresRestart: true as const,
    default: {},
    get description() {
      return getStrings().settingsDescSettingsForExtensions;
    },
    showInDialog: false as const,
    properties: {
      disabled: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelDisabledExtensions;
        },
        get category() { return getStrings().settingsLabelCategoryExtensions; },
        requiresRestart: true as const,
        default: [] as string[],
        get description() {
          return getStrings().settingsDescListOfDisabledExtensions;
        },
        showInDialog: false as const,
        items: { type: 'string' as const },
        mergeStrategy: MergeStrategy.UNION,
      },
      workspacesWithMigrationNudge: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelWorkspacesWithMigrationNudge;
        },
        get category() { return getStrings().settingsLabelCategoryExtensions; },
        requiresRestart: false as const,
        default: [] as string[],
        get description() {
          return getStrings().settingsDescSettingsForExtensions;
        },
        showInDialog: false as const,
        items: { type: 'string' as const },
        mergeStrategy: MergeStrategy.UNION,
      },
    },
  },

  skills: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelSkills;
    },
    get category() { return getStrings().settingsLabelCategoryAdvanced; },
    requiresRestart: true as const,
    default: {},
    get description() {
      return getStrings().settingsDescSettingsForAgentSkills;
    },
    showInDialog: false as const,
    properties: {
      enabled: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelEnableAgentSkills;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: true as const,
        default: true,
        get description() {
          return getStrings().settingsDescEnableAgentSkills;
        },
        showInDialog: true as const,
      },
      disabled: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelDisabledSkills;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: true as const,
        default: [] as string[],
        get description() {
          return getStrings().settingsDescListOfDisabledSkills;
        },
        showInDialog: false as const,
        items: { type: 'string' as const },
        mergeStrategy: MergeStrategy.UNION,
      },
    },
  },

  hooksConfig: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelHooksconfig;
    },
    get category() { return getStrings().settingsLabelCategoryAdvanced; },
    requiresRestart: false as const,
    default: {},
    get description() {
      return getStrings().settingsDescDefinesACustomShellCommand;
    },
    showInDialog: false as const,
    properties: {
      enabled: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelEnableHooks;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: true as const,
        default: true,
        get description() {
          return getStrings().settingsDescShowVisualIndicatorsWhenHo;
        },
        showInDialog: true as const,
      },
      disabled: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelDisabledHooks;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: false as const,
        default: [] as string[],
        get description() {
          return getStrings().settingsDescHookCommandName;
        },
        showInDialog: false as const,
        items: {
          type: 'string' as const,
          get description() {
            return getStrings().settingsDescHookCommandName;
          },
        },
        mergeStrategy: MergeStrategy.UNION,
      },
      notifications: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelHookNotifications;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: false as const,
        default: true,
        get description() {
          return getStrings().settingsDescShowVisualIndicatorsWhenHo;
        },
        showInDialog: true as const,
      },
    },
  },

  hooks: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelHookEvents;
    },
    get category() { return getStrings().settingsLabelCategoryAdvanced; },
    requiresRestart: false as const,
    default: {},
    get description() {
      return getStrings().settingsDescEventSpecificHookConfigurat;
    },
    showInDialog: false as const,
    properties: {
      BeforeTool: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelBeforeToolHooks;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: false as const,
        default: [],
        get description() {
          return getStrings().settingsDescDefinesACustomShellCommand;
        },
        showInDialog: false as const,
        ref: 'HookDefinitionArray' as const,
        mergeStrategy: MergeStrategy.CONCAT,
      },
      AfterTool: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelAfterToolHooks;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: false as const,
        default: [],
        get description() {
          return getStrings().settingsDescDefinesACustomShellCommand;
        },
        showInDialog: false as const,
        ref: 'HookDefinitionArray' as const,
        mergeStrategy: MergeStrategy.CONCAT,
      },
      BeforeAgent: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelBeforeAgentHooks;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: false as const,
        default: [],
        get description() {
          return getStrings().settingsDescDefinesACustomShellCommand;
        },
        showInDialog: false as const,
        ref: 'HookDefinitionArray' as const,
        mergeStrategy: MergeStrategy.CONCAT,
      },
      AfterAgent: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelAfterAgentHooks;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: false as const,
        default: [],
        get description() {
          return getStrings().settingsDescDefinesACustomShellCommand;
        },
        showInDialog: false as const,
        ref: 'HookDefinitionArray' as const,
        mergeStrategy: MergeStrategy.CONCAT,
      },
      Notification: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelNotificationHooks;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: false as const,
        default: [],
        get description() {
          return getStrings().settingsDescDefinesACustomShellCommand;
        },
        showInDialog: false as const,
        ref: 'HookDefinitionArray' as const,
        mergeStrategy: MergeStrategy.CONCAT,
      },
      SessionStart: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelSessionStartHooks;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: false as const,
        default: [],
        get description() {
          return getStrings().settingsDescDefinesACustomShellCommand;
        },
        showInDialog: false as const,
        ref: 'HookDefinitionArray' as const,
        mergeStrategy: MergeStrategy.CONCAT,
      },
      SessionEnd: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelSessionEndHooks;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: false as const,
        default: [],
        get description() {
          return getStrings().settingsDescDefinesACustomShellCommand;
        },
        showInDialog: false as const,
        ref: 'HookDefinitionArray' as const,
        mergeStrategy: MergeStrategy.CONCAT,
      },
      PreCompress: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelPreCompressHooks;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: false as const,
        default: [],
        get description() {
          return getStrings().settingsDescDefinesACustomShellCommand;
        },
        showInDialog: false as const,
        ref: 'HookDefinitionArray' as const,
        mergeStrategy: MergeStrategy.CONCAT,
      },
      BeforeModel: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelBeforeModelHooks;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: false as const,
        default: [],
        get description() {
          return getStrings().settingsDescDefinesACustomShellCommand;
        },
        showInDialog: false as const,
        ref: 'HookDefinitionArray' as const,
        mergeStrategy: MergeStrategy.CONCAT,
      },
      AfterModel: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelAfterModelHooks;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: false as const,
        default: [],
        get description() {
          return getStrings().settingsDescDefinesACustomShellCommand;
        },
        showInDialog: false as const,
        ref: 'HookDefinitionArray' as const,
        mergeStrategy: MergeStrategy.CONCAT,
      },
      BeforeToolSelection: {
        type: 'array' as const,
        get label() {
          return getStrings().settingsLabelBeforeToolSelectionHooks;
        },
        get category() { return getStrings().settingsLabelCategoryAdvanced; },
        requiresRestart: false as const,
        default: [],
        get description() {
          return getStrings().settingsDescDefinesACustomShellCommand;
        },
        showInDialog: false as const,
        ref: 'HookDefinitionArray' as const,
        mergeStrategy: MergeStrategy.CONCAT,
      },
    },
    additionalProperties: {
      type: 'array' as const,
      get description() {
        return getStrings().settingsDescCustomThemeDefinitions;
      },
      mergeStrategy: MergeStrategy.CONCAT,
    },
  },

  admin: {
    type: 'object' as const,
    get label() {
      return getStrings().settingsLabelAdmin;
    },
    get category() { return getStrings().settingsLabelCategoryAdmin; },
    requiresRestart: false as const,
    default: {},
    get description() {
      return getStrings().settingsDescSettingsConfiguredRemotelyB;
    },
    showInDialog: false as const,
    mergeStrategy: MergeStrategy.REPLACE,
    properties: {
      secureModeEnabled: {
        type: 'boolean' as const,
        get label() {
          return getStrings().settingsLabelSecureModeEnabled;
        },
        get category() { return getStrings().settingsLabelCategoryAdmin; },
        requiresRestart: false as const,
        default: false,
        get description() {
          return getStrings().settingsDescIfTrue;
        },
        showInDialog: false as const,
        mergeStrategy: MergeStrategy.REPLACE,
      },
      extensions: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelExtensionsSettings;
        },
        get category() { return getStrings().settingsLabelCategoryAdmin; },
        requiresRestart: false as const,
        default: {},
        get description() {
          return getStrings().settingsDescExtensionsSpecificAdminSett;
        },
        showInDialog: false as const,
        mergeStrategy: MergeStrategy.REPLACE,
        properties: {
          enabled: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelExtensionsEnabled;
            },
            get category() { return getStrings().settingsLabelCategoryAdmin; },
            requiresRestart: false as const,
            default: true,
            get description() {
              return getStrings().settingsDescIfFalse;
            },
            showInDialog: false as const,
            mergeStrategy: MergeStrategy.REPLACE,
          },
        },
      },
      mcp: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelMcpSettings;
        },
        get category() { return getStrings().settingsLabelCategoryAdmin; },
        requiresRestart: false as const,
        default: {},
        get description() {
          return getStrings().settingsDescMcpSpecificAdminSettings;
        },
        showInDialog: false as const,
        mergeStrategy: MergeStrategy.REPLACE,
        properties: {
          enabled: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelMcpEnabled;
            },
            get category() { return getStrings().settingsLabelCategoryAdmin; },
            requiresRestart: false as const,
            default: true,
            get description() {
              return getStrings().settingsDescIfFalse;
            },
            showInDialog: false as const,
            mergeStrategy: MergeStrategy.REPLACE,
          },
          config: {
            type: 'object' as const,
            get label() {
              return getStrings().settingsLabelMcpConfig;
            },
            get category() { return getStrings().settingsLabelCategoryAdmin; },
            requiresRestart: false as const,
            default: {} as Record<string, MCPServerConfig>,
            get description() {
              return getStrings().settingsDescAdminConfiguredMcpServers;
            },
            showInDialog: false as const,
            mergeStrategy: MergeStrategy.REPLACE,
            additionalProperties: {
              type: 'object' as const,
              ref: 'MCPServerConfig' as const,
            },
          },
        },
      },
      skills: {
        type: 'object' as const,
        get label() {
          return getStrings().settingsLabelSkillsSettings;
        },
        get category() { return getStrings().settingsLabelCategoryAdmin; },
        requiresRestart: false as const,
        default: {},
        get description() {
          return getStrings().settingsDescAgentSkillsSpecificAdminSe;
        },
        showInDialog: false as const,
        mergeStrategy: MergeStrategy.REPLACE,
        properties: {
          enabled: {
            type: 'boolean' as const,
            get label() {
              return getStrings().settingsLabelSkillsEnabled;
            },
            get category() { return getStrings().settingsLabelCategoryAdmin; },
            requiresRestart: false as const,
            default: true,
            get description() {
              return getStrings().settingsDescIfFalse;
            },
            showInDialog: false as const,
            mergeStrategy: MergeStrategy.REPLACE,
          },
        },
      },
    },
  },
} satisfies SettingsSchema;

export type SettingsSchemaType = typeof SETTINGS_SCHEMA;

export type SettingsJsonSchemaDefinition = Record<string, unknown>;

export const SETTINGS_SCHEMA_DEFINITIONS: Record<
  string,
  SettingsJsonSchemaDefinition
> = {
  MCPServerConfig: {
    type: 'object',
    description:
      'Definition of a Model Context Protocol (MCP) server configuration.',
    additionalProperties: false,
    properties: {
      command: {
        type: 'string',
        description: 'Executable invoked for stdio transport.',
      },
      args: {
        type: 'array',
        description: 'Command-line arguments for the stdio transport command.',
        items: { type: 'string' },
      },
      env: {
        type: 'object',
        description: 'Environment variables to set for the server process.',
        additionalProperties: { type: 'string' },
      },
      cwd: {
        type: 'string',
        description: 'Working directory for the server process.',
      },
      url: {
        type: 'string',
        description:
          'URL for SSE or HTTP transport. Use with "type" field to specify transport type.',
      },
      httpUrl: {
        type: 'string',
        description: 'Streaming HTTP transport URL.',
      },
      headers: {
        type: 'object',
        description: 'Additional HTTP headers sent to the server.',
        additionalProperties: { type: 'string' },
      },
      tcp: {
        type: 'string',
        description: 'TCP address for websocket transport.',
      },
      type: {
        type: 'string',
        description:
          'Transport type. Use "stdio" for local command, "sse" for Server-Sent Events, or "http" for Streamable HTTP.',
        enum: ['stdio', 'sse', 'http'],
      },
      timeout: {
        type: 'number',
        description: 'Timeout in milliseconds for MCP requests.',
      },
      trust: {
        type: 'boolean',
        description:
          'Marks the server as trusted. Trusted servers may gain additional capabilities.',
      },
      description: {
        type: 'string',
        description: 'Human-readable description of the server.',
      },
      includeTools: {
        type: 'array',
        description:
          'Subset of tools that should be enabled for this server. When omitted all tools are enabled.',
        items: { type: 'string' },
      },
      excludeTools: {
        type: 'array',
        description:
          'Tools that should be disabled for this server even if exposed.',
        items: { type: 'string' },
      },
      extension: {
        type: 'object',
        description:
          'Metadata describing the Gemini CLI extension that owns this MCP server.',
        additionalProperties: { type: ['string', 'boolean', 'number'] },
      },
      oauth: {
        type: 'object',
        description: 'OAuth configuration for authenticating with the server.',
        additionalProperties: true,
      },
      authProviderType: {
        type: 'string',
        description:
          'Authentication provider used for acquiring credentials (for example `dynamic_discovery`).',
        enum: [
          'dynamic_discovery',
          'google_credentials',
          'service_account_impersonation',
        ],
      },
      targetAudience: {
        type: 'string',
        description:
          'OAuth target audience (CLIENT_ID.apps.googleusercontent.com).',
      },
      targetServiceAccount: {
        type: 'string',
        description:
          'Service account email to impersonate (name@project.iam.gserviceaccount.com).',
      },
    },
  },
  TelemetrySettings: {
    type: 'object',
    description: 'Telemetry configuration for Gemini CLI.',
    additionalProperties: false,
    properties: {
      enabled: {
        type: 'boolean',
        description: 'Enables telemetry emission.',
      },
      target: {
        type: 'string',
        description:
          'Telemetry destination (for example `stderr`, `stdout`, or `otlp`).',
      },
      otlpEndpoint: {
        type: 'string',
        description: 'Endpoint for OTLP exporters.',
      },
      otlpProtocol: {
        type: 'string',
        description: 'Protocol for OTLP exporters.',
        enum: ['grpc', 'http'],
      },
      logPrompts: {
        type: 'boolean',
        description: 'Whether prompts are logged in telemetry payloads.',
      },
      outfile: {
        type: 'string',
        description: 'File path for writing telemetry output.',
      },
      useCollector: {
        type: 'boolean',
        description: 'Whether to forward telemetry to an OTLP collector.',
      },
      useCliAuth: {
        type: 'boolean',
        description:
          'Whether to use CLI authentication for telemetry (only for in-process exporters).',
      },
    },
  },
  BugCommandSettings: {
    type: 'object',
    description: 'Configuration for the bug report helper command.',
    additionalProperties: false,
    properties: {
      urlTemplate: {
        type: 'string',
        description:
          'Template used to open a bug report URL. Variables in the template are populated at runtime.',
      },
    },
    required: ['urlTemplate'],
  },
  SummarizeToolOutputSettings: {
    type: 'object',
    description:
      'Controls summarization behavior for individual tools. All properties are optional.',
    additionalProperties: false,
    properties: {
      tokenBudget: {
        type: 'number',
        description:
          'Maximum number of tokens used when summarizing tool output.',
      },
    },
  },
  AgentOverride: {
    type: 'object',
    description: 'Override settings for a specific agent.',
    additionalProperties: false,
    properties: {
      modelConfig: {
        type: 'object',
        additionalProperties: true,
      },
      runConfig: {
        type: 'object',
        description: 'Run configuration for an agent.',
        additionalProperties: false,
        properties: {
          maxTimeMinutes: {
            type: 'number',
            description: 'The maximum execution time for the agent in minutes.',
          },
          maxTurns: {
            type: 'number',
            description: 'The maximum number of conversational turns.',
          },
        },
      },
      enabled: {
        type: 'boolean',
        description: 'Whether to enable the agent.',
      },
    },
  },
  CustomTheme: {
    type: 'object',
    description:
      'Custom theme definition used for styling Gemini CLI output. Colors are provided as hex strings or named ANSI colors.',
    additionalProperties: false,
    properties: {
      type: {
        type: 'string',
        enum: ['custom'],
        default: 'custom',
      },
      name: {
        type: 'string',
        description: 'Theme display name.',
      },
      text: {
        type: 'object',
        additionalProperties: false,
        properties: {
          primary: { type: 'string' },
          secondary: { type: 'string' },
          link: { type: 'string' },
          accent: { type: 'string' },
        },
      },
      background: {
        type: 'object',
        additionalProperties: false,
        properties: {
          primary: { type: 'string' },
          diff: {
            type: 'object',
            additionalProperties: false,
            properties: {
              added: { type: 'string' },
              removed: { type: 'string' },
            },
          },
        },
      },
      border: {
        type: 'object',
        additionalProperties: false,
        properties: {
          default: { type: 'string' },
          focused: { type: 'string' },
        },
      },
      ui: {
        type: 'object',
        additionalProperties: false,
        properties: {
          comment: { type: 'string' },
          symbol: { type: 'string' },
          gradient: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      status: {
        type: 'object',
        additionalProperties: false,
        properties: {
          error: { type: 'string' },
          success: { type: 'string' },
          warning: { type: 'string' },
        },
      },
      Background: { type: 'string' },
      Foreground: { type: 'string' },
      LightBlue: { type: 'string' },
      AccentBlue: { type: 'string' },
      AccentPurple: { type: 'string' },
      AccentCyan: { type: 'string' },
      AccentGreen: { type: 'string' },
      AccentYellow: { type: 'string' },
      AccentRed: { type: 'string' },
      DiffAdded: { type: 'string' },
      DiffRemoved: { type: 'string' },
      Comment: { type: 'string' },
      Gray: { type: 'string' },
      DarkGray: { type: 'string' },
      GradientColors: {
        type: 'array',
        items: { type: 'string' },
      },
    },
    required: ['type', 'name'],
  },
  StringOrStringArray: {
    description: 'Accepts either a single string or an array of strings.',
    anyOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
  },
  BooleanOrString: {
    description: 'Accepts either a boolean flag or a string command name.',
    anyOf: [{ type: 'boolean' }, { type: 'string' }],
  },
  HookDefinitionArray: {
    type: 'array',
    description: 'Array of hook definition objects for a specific event.',
    items: {
      type: 'object',
      description:
        'Hook definition specifying matcher pattern and hook configurations.',
      properties: {
        matcher: {
          type: 'string',
          description:
            'Pattern to match against the event context (tool name, notification type, etc.). Supports exact match, regex (/pattern/), and wildcards (*).',
        },
        hooks: {
          type: 'array',
          description: 'Hooks to execute when the matcher matches.',
          items: {
            type: 'object',
            description: 'Individual hook configuration.',
            properties: {
              name: {
                type: 'string',
                description: 'Unique identifier for the hook.',
              },
              type: {
                type: 'string',
                description:
                  'Type of hook (currently only "command" supported).',
              },
              command: {
                type: 'string',
                description:
                  'Shell command to execute. Receives JSON input via stdin and returns JSON output via stdout.',
              },
              description: {
                type: 'string',
                description: 'A description of the hook.',
              },
              timeout: {
                type: 'number',
                description: 'Timeout in milliseconds for hook execution.',
              },
            },
          },
        },
      },
    },
  },
};

export function getSettingsSchema(): SettingsSchemaType {
  return SETTINGS_SCHEMA;
}

type InferSettings<T extends SettingsSchema> = {
  -readonly [K in keyof T]?: T[K] extends { properties: SettingsSchema }
    ? InferSettings<T[K]['properties']>
    : T[K]['type'] extends 'enum'
      ? T[K]['options'] extends readonly SettingEnumOption[]
        ? T[K]['options'][number]['value']
        : T[K]['default']
      : T[K]['default'] extends boolean
        ? boolean
        : T[K]['default'];
};

type InferMergedSettings<T extends SettingsSchema> = {
  -readonly [K in keyof T]-?: T[K] extends { properties: SettingsSchema }
    ? InferMergedSettings<T[K]['properties']>
    : T[K]['type'] extends 'enum'
      ? T[K]['options'] extends readonly SettingEnumOption[]
        ? T[K]['options'][number]['value']
        : T[K]['default']
      : T[K]['default'] extends boolean
        ? boolean
        : T[K]['default'];
};

export type Settings = InferSettings<SettingsSchemaType>;
export type MergedSettings = InferMergedSettings<SettingsSchemaType>;
