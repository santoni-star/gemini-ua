#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = 'https://fdveuqzezqaopyidllkw.supabase.co';
// Для SQL через REST API потрібен service_role key
// Отримайте його в Supabase Dashboard -> Settings -> API
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SERVICE_ROLE_KEY) {
  console.log('❌ Потрібен SUPABASE_SERVICE_ROLE_KEY!');
  console.log('');
  console.log('📋 Як отримати:');
  console.log('   1. Відкрийте https://supabase.com/dashboard/project/fdveuqzezqaopyidllkw/settings/api');
  console.log('   2. Скопіюйте "service_role" ключ (починається з "eyJ...")');
  console.log('   3. Запустіть: export SUPABASE_SERVICE_ROLE_KEY="ваш_ключ"');
  console.log('   4. Запустіть цей скрипт знову');
  console.log('');
  console.log('💡 АБО просто виконайте SQL вручну через SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/fdveuqzezqaopyidllkw/sql/new');
  process.exit(1);
}

const SQL_FILE = path.join(__dirname, 'supabase', 'RESET_AND_REBUILD.sql');

function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL('/rest/v1/rpc/exec_sql', SUPABASE_URL);
    const postData = JSON.stringify({ sql: sql });

    const options = {
      method: 'POST',
      hostname: url.hostname,
      path: url.pathname,
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
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
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.write(postData);
    req.end();
  });
}

async function main() {
  console.log('=== Supabase SQL Migration ===\n');

  // Читаємо SQL файл
  if (!fs.existsSync(SQL_FILE)) {
    console.log(`❌ Файл не знайдено: ${SQL_FILE}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(SQL_FILE, 'utf8');
  console.log(`📄 SQL файл: ${sql.length} байт`);

  // Supabase REST API не підтримує прямий виконання довільного SQL
  // Тому потрібно використовувати інший підхід
  console.log('\n⚠️  Supabase REST API не підтримує прямий виконання довільного SQL.');
  console.log('\n📋 Єдиний надійний спосіб — виконати SQL вручну через SQL Editor:');
  console.log('');
  console.log('   1. Відкрийте: https://supabase.com/dashboard/project/fdveuqzezqaopyidllkw/sql/new');
  console.log('   2. Скопіюйте вміст файлу:');
  console.log(`      ${SQL_FILE}`);
  console.log('   3. Вставте в SQL Editor');
  console.log('   4. Натисніть ▶️ Run (або Ctrl+Enter)');
  console.log('');
  console.log('💡 Файл містить 615 рядків — це займе ~10 секунд.');
}

main().catch(console.error);
