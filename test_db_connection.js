const { Client } = require('pg');

// Спроба підключення через різні хости
const configs = [
  {
    name: 'Direct (IPv4)',
    host: 'db.fdveuqzezqaopyidllkw.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Nosferaded123!!@',
    ssl: { rejectUnauthorized: false }
  },
  {
    name: 'Pooler (Transaction)',
    host: 'aws-0-us-east-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres.fdveuqzezqaopyidllkw',
    password: 'Nosferaded123!!@',
    ssl: { rejectUnauthorized: false }
  },
  {
    name: 'Pooler (Session)',
    host: 'aws-0-us-east-1.pooler.supabase.com',
    port: 6543,
    database: 'postgres',
    user: 'postgres.fdveuqzezqaopyidllkw',
    password: 'Nosferaded123!!@',
    ssl: { rejectUnauthorized: false }
  }
];

async function tryConnect(config) {
  console.log(`\n🔌 Спроба: ${config.name}`);
  console.log(`   Хост: ${config.host}:${config.port}`);
  
  const client = new Client(config);
  try {
    await client.connect();
    console.log(`   ✅ Підключення успішне!`);
    
    // Перевірка таблиць
    const { rows } = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (rows.length > 0) {
      console.log(`   📋 Таблиці (${rows.length}):`);
      rows.forEach(r => console.log(`      - ${r.table_name}`));
    } else {
      console.log(`   ❌ Таблиць немає!`);
    }
    
    await client.end();
    return true;
  } catch (e) {
    console.log(`   ❌ Помилка: ${e.message.split('\n')[0]}`);
    return false;
  }
}

async function main() {
  console.log('=== Supabase Database Connection Test ===\n');
  
  for (const config of configs) {
    const success = await tryConnect(config);
    if (success) {
      console.log('\n✅ Знайдено робоче підключення!');
      return;
    }
  }
  
  console.log('\n❌ Жодне підключення не працює.');
  console.log('\n💡 Можливі причини:');
  console.log('   1. IPv6 не працює — спробуйте через VPN/proxy');
  console.log('   2. Пароль неправильний');
  console.log('   3. Проект видалений або призупинений');
}

main().catch(console.error);
