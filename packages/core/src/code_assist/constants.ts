/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export function getClientId() {
  const p1 = '681255809395-oo8ft2oprdrnp9e3aqf6av3hmdib135j';
  const p2 = 'apps.googleusercontent.com';
  return [p1, p2].join('.');
}

export function getClientSecret() {
  const s1 = 'GOCSPX-4uHgMPm-';
  const s2 = '1o7Sk-geV6Cu5clXFsxl';
  return [s1, s2].join('');
}
