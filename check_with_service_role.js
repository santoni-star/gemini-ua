#!/usr/bin/env node

const https = require('https');

// Отримайте service_role ключ з Supabase Dashboard
const SUPABASE_URL = 'https://fdveuqzezqaopyidllkw.supabase.co';
const SERVICE_ROLE_KEY = process.argv[2];

if (!SERVICE_ROLE_KEY) {
  console.log('Використання: node check_with_service_role.js <service_role_key>');
  console.log('Отримайте ключ: https://supabase.com/dashboard/project/fdveuqzezqaopyidllkw/settings/api');
  process.exit(1);
}

function apiRequest(method, urlPath, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, SUPABASE_URL);
    const options = {
      method: method,
      hostname: url.hostname,
      path: url.pathname + url.search,
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
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

async function main() {
  console.log('=== Перевірка таблиць з service_role ключем ===\n');

  const tables = ['companies', 'profiles', 'shifts', 'messages', 'polls', 'tasks'];

  for (const table of tables) {
    try {
      const result = await apiRequest('GET', `/rest/v1/${table}?limit=1`);
      if (result.status === 200) {
        console.log(`  ✅ ${table} - існує`);
      } else {
        console.log(`  ❌ ${table} - статус: ${result.status}`);
        console.log(`     ${result.data.substring(0, 150)}`);
      }
    } catch (e) {
      console.log(`  ❌ ${table} - помилка: ${e.message}`);
    }
  }

  // Перевірка Demo Company
  console.log('\n🏢 Перевірка Demo Company...');
  try {
    const result = await apiRequest('GET', '/rest/v1/companies?id=eq.00000000-0000-0000-0000-000000000001');
    if (result.status === 200) {
      const data = JSON.parse(result.data);
      if (data.length > 0) {
        console.log(`  ✅ Demo Company: ${data[0].name} (${data[0].code})`);
      } else {
        console.log(`  ❌ Demo Company не знайдено`);
      }
    } else {
      console.log(`  ❌ Статус: ${result.status}`);
    }
  } catch (e) {
    console.log(`  ❌ Помилка: ${e.message}`);
  }
}

main().catch(console.error);
