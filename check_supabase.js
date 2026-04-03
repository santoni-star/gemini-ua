#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://fdveuqzezqaopyidllkw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_pPWPl5Gq0aOQHG4MVnCQaw_2S8F9zYc';

function apiRequest(method, urlPath, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, SUPABASE_URL);
    const options = {
      method: method,
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, data: data });
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function checkTables() {
  console.log('🔍 Перевірка таблиць...');

  const tables = ['companies', 'profiles', 'shifts', 'messages', 'polls', 'tasks'];

  for (const table of tables) {
    try {
      const result = await apiRequest('GET', `/rest/v1/${table}?limit=1`);
      if (result.status === 200) {
        console.log(`  ✅ ${table} - існує`);
      } else if (result.status === 404 || (result.data && result.data.includes('relation'))) {
        console.log(`  ❌ ${table} - НЕ ІСНУЄ`);
      } else {
        console.log(`  ⚠️  ${table} - статус: ${result.status}`);
      }
    } catch (e) {
      console.log(`  ❌ ${table} - помилка: ${e.message}`);
    }
  }
}

async function checkUsers() {
  console.log('\n👥 Перевірка користувачів (через Auth)...');
  // REST API не може напряму перевірити auth users, але можемо перевірити profiles
  try {
    const result = await apiRequest('GET', '/rest/v1/profiles?select=count');
    console.log(`  Відповідь profiles: ${result.status}`);
  } catch (e) {
    console.log(`  Помилка: ${e.message}`);
  }
}

async function testInsert() {
  console.log('\n🧪 Тестове внесення в companies...');
  try {
    const result = await apiRequest('POST', '/rest/v1/companies', {
      name: 'Test Company',
      code: 'TEST' + Date.now(),
      plan_tier: 'starter'
    });
    console.log(`  Статус: ${result.status}`);
    if (result.status >= 200 && result.status < 300) {
      console.log('  ✅ Внесення успішне!');
    } else {
      console.log(`  ❌ Помилка: ${result.data.substring(0, 200)}`);
    }
  } catch (e) {
    console.log(`  ❌ Помилка: ${e.message}`);
  }
}

async function main() {
  console.log('=== Supabase Connection Test ===\n');
  await checkTables();
  await checkUsers();
  await testInsert();
  console.log('\n=== Готово ===');
}

main().catch(console.error);
