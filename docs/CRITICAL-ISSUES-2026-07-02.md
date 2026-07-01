# MILESTONE — E2E TEST FIX

**Date:** 2026-07-02
**Status:** IN PROGRESS

---

## ROOT CAUSE ANALYSIS

### Error Pattern
```
Received: "http://localhost:4173/command-center-pamtas/login"
```
Tests redirect to login page = authentication failed

### Test Results
| Test File | Status |
|------------|--------|
| critical-pages.spec.js | 13/13 PASS ✅ |
| admin.spec.js | 0/9 PASS ❌ |
| binter.spec.js | 0/5 PASS ❌ |
| home.spec.js | 0/7 PASS ❌ |
| insiden.spec.js | 0/7 PASS ❌ |
| laporan.spec.js | 0/7 PASS ❌ |

### Analysis
1. `critical-pages.spec.js` uses `login()` helper → PASS
2. Old tests (admin.spec.js, etc.) have login in `beforeEach` → FAIL

**Conclusion:** Login IS being called, but authentication is failing.

### Possible Causes
1. **Test credentials are fake** - `test@pamtas.mil.id / test1234` not registered in Supabase
2. **Supabase Auth not configured** - no users created in auth table
3. **Network issue** - CI cannot reach Supabase

---

## ACTION ITEMS

### 1. Create Test User via Supabase Dashboard
```
1. Go to: https://supabase.com/dashboard
2. Select project
3. Go to Authentication > Users
4. Click "Add user" / "Create user"
5. Create user with:
   - Email: any valid email you control
   - Password: a strong password
6. Copy the credentials
```

### 2. Update GitHub Secrets
```
1. Go to: https://github.com/yonkav8nsw/command-center-pamtas/settings/secrets/actions
2. Edit E2E_ADMIN_EMAIL → your test user's email
3. Edit E2E_ADMIN_PASSWORD → your test user's password
```

### 3. Alternative: Use Service Role Key (Programmatic)
If you have the service role key from Supabase > Settings > API:
```bash
SUPABASE_SERVICE_ROLE_KEY=your-key node scripts/create-test-user.js
```

---

## FILES CREATED

- `scripts/create-test-user.js` - Script to programmatically create test user

---

## TEST COMMANDS

```bash
# Run all tests (after credentials configured)
npm run test:e2e

# Run with inline credentials
E2E_ADMIN_EMAIL="test@example.com" E2E_ADMIN_PASSWORD="pass123" npm run test:e2e

# Run specific test
npm run test:e2e -- --grep "Admin"
```

---

*Created: 2026-07-02*
