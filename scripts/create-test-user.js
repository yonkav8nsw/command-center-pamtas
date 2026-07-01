#!/usr/bin/env node
/**
 * Script to create a test user for E2E tests
 *
 * Usage:
 *   node scripts/create-test-user.js
 *
 * Requires environment variables:
 *   - SUPABASE_URL (your project URL)
 *   - SUPABASE_SERVICE_ROLE_KEY (service role key from Supabase Dashboard > Settings > API)
 *
 * Or set them inline:
 *   SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/create-test-user.js
 */

import https from 'https';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://spjowkabolganxfjgqge.supabase.co';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY');
  console.log('');
  console.log('To get your service role key:');
  console.log('1. Go to https://supabase.com/dashboard');
  console.log('2. Select your project');
  console.log('3. Go to Settings > API');
  console.log('4. Copy the service_role secret');
  console.log('');
  console.log('Set it as environment variable:');
  console.log('  export SUPABASE_SERVICE_ROLE_KEY=your-key-here');
  console.log('  node scripts/create-test-user.js');
  process.exit(1);
}

const hostname = new URL(SUPABASE_URL).hostname;

const userEmail = process.env.TEST_USER_EMAIL || 'e2e@test.com';
const userPassword = process.env.TEST_USER_PASSWORD || 'SecureTest123!';

async function createUser() {
  const data = JSON.stringify({
    email: userEmail,
    password: userPassword,
    email_confirm: true,
    user_metadata: { role: 'admin' }
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      port: 443,
      path: '/auth/v1/admin/users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const user = JSON.parse(body);
          console.log('✅ User created successfully!');
          console.log('');
          console.log('📋 Test credentials:');
          console.log(`   Email: ${user.email}`);
          console.log(`   Password: ${userPassword}`);
          console.log('');
          console.log('🔐 GitHub Secrets to update:');
          console.log(`   E2E_ADMIN_EMAIL=${userEmail}`);
          console.log(`   E2E_ADMIN_PASSWORD=${userPassword}`);
          resolve(user);
        } else {
          console.error('❌ Failed to create user');
          console.error('Status:', res.statusCode);
          console.error('Response:', body);
          reject(new Error(body));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

createUser().catch(e => {
  console.error(e.message);
  process.exit(1);
});
