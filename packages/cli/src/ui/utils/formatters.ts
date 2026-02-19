/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  REFERENCE_CONTENT_START,
  REFERENCE_CONTENT_END,
} from '@google/gemini-cli-core';
import { strings, getLocale } from '../../i18n.js';

export const formatBytes = (bytes: number): string => {
  const gb = bytes / (1024 * 1024 * 1024);
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} ${strings.unitKB}`;
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} ${strings.unitMB}`;
  }
  return `${gb.toFixed(2)} ${strings.unitGB}`;
};

/**
 * Formats a duration in milliseconds into a concise, human-readable string (e.g., "1h 5s").
 * It omits any time units that are zero.
 * @param milliseconds The duration in milliseconds.
 * @returns A formatted string representing the duration.
 */
export const formatDuration = (milliseconds: number): string => {
  if (milliseconds <= 0) {
    return `0${strings.unitSecond}`;
  }

  if (milliseconds < 1000) {
    return `${Math.round(milliseconds)}${strings.unitMillisecond}`;
  }

  const totalSeconds = milliseconds / 1000;

  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(1)}${strings.unitSecond}`;
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}${strings.unitHour}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}${strings.unitMinute}`);
  }
  if (seconds > 0) {
    parts.push(`${seconds}${strings.unitSecond}`);
  }

  // If all parts are zero (e.g., exactly 1 hour), return the largest unit.
  if (parts.length === 0) {
    if (hours > 0) return `${hours}${strings.unitHour}`;
    if (minutes > 0) return `${minutes}${strings.unitMinute}`;
    return `${seconds}${strings.unitSecond}`;
  }

  return parts.join(' ');
};

export const formatTimeAgo = (date: string | number | Date): string => {
  const past = new Date(date);
  if (isNaN(past.getTime())) {
    return strings.chatListInvalidDate;
  }

  const now = new Date();
  const diffMs = now.getTime() - past.getTime();
  if (diffMs < 60000) {
    return strings.sessionBrowserCurrent; // Using "Current" as close enough to "just now" or add a new key
  }
  // Simplified localized relative time
  return `${formatDuration(diffMs)} ${strings.sessionBrowserHeaderAge}`; // "5m age" -> "5m тому" (need to adjust key)
};

/**
 * Removes content bounded by reference content markers from the given text.
 * The markers are "${REFERENCE_CONTENT_START}" and "${REFERENCE_CONTENT_END}".
 *
 * @param text The input text containing potential reference blocks.
 * @returns The text with reference blocks removed and trimmed.
 */
export function stripReferenceContent(text: string): string {
  // Match optional newline, the start marker, content (non-greedy), and the end marker
  const pattern = new RegExp(
    `\\n?${REFERENCE_CONTENT_START}[\\s\\S]*?${REFERENCE_CONTENT_END}`,
    'g',
  );

  return text.replace(pattern, '').trim();
}

export const formatResetTime = (resetTime: string): string => {
  const diff = new Date(resetTime).getTime() - Date.now();
  if (diff <= 0) return '';

  const totalMinutes = Math.ceil(diff / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const locale = getLocale();
  const fmt = (val: number, unit: 'hour' | 'minute') =>
    new Intl.NumberFormat(locale === 'ua' ? 'uk-UA' : 'en-US', {
      style: 'unit',
      unit,
      unitDisplay: 'narrow',
    }).format(val);

  const timeString =
    hours > 0 && minutes > 0
      ? `${fmt(hours, 'hour')} ${fmt(minutes, 'minute')}`
      : hours > 0
        ? fmt(hours, 'hour')
        : fmt(minutes, 'minute');

  return strings.statsResetsIn.replace('{time}', timeString);
};
