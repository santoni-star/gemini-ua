/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { strings } from '../../i18n.js';

export const formatMemoryUsage = (bytes: number): string => {
  const gb = bytes / (1024 * 1024 * 1024);
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${gb.toFixed(2)} GB`;
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
