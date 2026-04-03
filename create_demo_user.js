const https = require('https');

const SUPABASE_URL = 'https://fdveuqzezqaopyidllkw.supabase.co';
const ANON_KEY = 'sb_publishable_pPWPl5Gq0aOQHG4MVnCQaw_2S8F9zYc';

const data = JSON.stringify({
  email: 'demo@demo.com',
  password: 'demodemo',
  data: {
    full_name: 'Demo User',
    company_id: '00000000-0000-0000-0000-000000000001'
  }
});

const options = {
  hostname: 'fdveuqzezqaopyidllkw.supabase.co',
  path: '/auth/v1/signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': ANON_KEY,
    'Authorization': `Bearer ${ANON_KEY}`
  }
};

const req = https.request(options, (res) => {
  let body = '';
  res.on('data', (d) => body += d);
  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('✅ Demo user created/exists!');
    } else {
      console.log('❌ Error:', body);
    }
  });
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
