# Auth E2E Flow Test — Manual Test Document

## Test Date: 09/03/2026
## Tester: Backend Team
## Status: ✅ PASSED

---

## Test 1: Login with valid credentials
**Steps:**
1. POST /api/Auth/login
2. Body: { "email": "admin@smartinventory.com", "password": "admin1234" }

**Expected:** 200 OK + accessToken + refreshToken
**Result:** ✅ PASSED

---

## Test 2: Login with invalid password
**Steps:**
1. POST /api/Auth/login
2. Body: { "email": "admin@smartinventory.com", "password": "wrongpassword" }

**Expected:** 401 Unauthorized + "Invalid email or password"
**Result:** ✅ PASSED

---

## Test 3: Access protected route without token
**Steps:**
1. GET /api/users (no Authorization header)

**Expected:** 401 Unauthorized
**Result:** ✅ PASSED

---

## Test 4: Access protected route with valid token
**Steps:**
1. POST /api/Auth/login → copy accessToken
2. GET /api/users with header: Authorization: Bearer {token}

**Expected:** 200 OK + users list
**Result:** ✅ PASSED

---

## Test 5: Access Admin-only route with non-Admin token
**Steps:**
1. Login as INVENTORY_MANAGER
2. GET /api/users with token

**Expected:** 403 Forbidden
**Result:** ✅ PASSED

---

## Test 6: Register new user as Admin
**Steps:**
1. Login as Admin → copy token
2. POST /api/Auth/register with token
3. Body: { "name": "Test", "email": "test@test.com", "password": "test1234", "role": "INVENTORY_MANAGER" }

**Expected:** 200 OK + userId
**Result:** ✅ PASSED

---

## Test 7: Register new user without Admin token
**Steps:**
1. POST /api/Auth/register (no token)
2. Body: { "name": "Test", "email": "test@test.com", "password": "test1234", "role": "INVENTORY_MANAGER" }

**Expected:** 401 Unauthorized
**Result:** ✅ PASSED