# ADMIN PANEL - TEST USER MANAGEMENT
## Grant Free Access + Testing Tools

---

## OVERVIEW

Simple admin panel that allows you to:
1. Grant free access to friends/family/testers
2. Test the entire portal flow yourself
3. View all test users
4. Revoke access if needed
5. No Stripe purchase required for test users

**URL:** thearchivistmethod.com/admin  
**Access:** Password-protected (only you can access)

---

## ADMIN PASSWORD

**Set this in Replit Secrets:**
```
ADMIN_PASSWORD = YourSecurePasswordHere123!
```

**Recommended password structure:**
- 16+ characters
- Mix of letters, numbers, symbols
- Example: `Pattern!Archivist#2026$Admin`

---

## HOW TO USE (QUICK START)

### **Give Access to Friends/Family:**

1. Go to `thearchivistmethod.com/admin`
2. Enter your admin password
3. Fill in form:
   - Email: `friend@example.com`
   - Access Level: `Complete Archive` (full access)
   - Note: `Mom - testing` (optional)
4. Click "Add User"
5. Tell them: "Login at thearchivistmethod.com/portal/login with your email"

**They get instant access. No payment needed.**

---

### **Test It Yourself:**

1. Go to admin panel
2. Add your email: `houstoninvestments@gmail.com`
3. Access Level: `Complete Archive`
4. Note: `Aaron - testing`
5. Login to portal with that email
6. Test everything (PDFs, AI chat, crash course, etc.)

---

## FEATURES

### **Dashboard Stats:**
- Total test users
- Breakdown by access level (Crash Course / Quick-Start / Archive)

### **Add User Form:**
- Email input
- Access level selector
- Optional note field
- One-click add

### **User Management:**
- View all test users in table
- See email, access level, note, date added
- Delete button for each user

---

## DATABASE SCHEMA

```sql
CREATE TABLE test_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  access_level VARCHAR(50) NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Access levels:**
- `crash-course` = Free tier only
- `quick-start` = Crash Course + Quick-Start
- `archive` = Everything (Crash Course + Quick-Start + Archive)

---

## API ENDPOINTS

### **1. Admin Login**
```
POST /api/admin/login
Body: { "password": "your-admin-password" }
Response: { "token": "admin-session-token" }
```

### **2. Add Test User**
```
POST /api/admin/add-test-user
Headers: { "Authorization": "Bearer {token}" }
Body: { 
  "email": "user@example.com",
  "accessLevel": "archive",
  "note": "Mom - testing"
}
```

### **3. Get All Test Users**
```
GET /api/admin/test-users
Headers: { "Authorization": "Bearer {token}" }
Response: [{ id, email, access_level, note, created_at }]
```

### **4. Delete Test User**
```
DELETE /api/admin/test-user/{id}
Headers: { "Authorization": "Bearer {token}" }
```

---

## PORTAL LOGIN LOGIC (UPDATED)

```javascript
// When user tries to login to portal:

1. Check test_users table for their email
   - If found → Grant access based on access_level
   - Mark session as test_user = true
   
2. If NOT in test_users, check purchases table
   - If found → Grant access based on purchased product
   - Mark session as test_user = false
   
3. If NOT in either table
   - Show error: "No account found. Please purchase first."
```

**Test users bypass Stripe entirely.**

---

## WHAT TEST USERS SEE

Portal looks **identical** to paying customers:
- ✅ Pattern analysis
- ✅ 7-Day Crash Course
- ✅ Quick-Start System (if access level includes it)
- ✅ Complete Archive (if access level includes it)
- ✅ PDF viewers
- ✅ AI chatbot
- ✅ Everything normal

They **DON'T see:**
- ❌ "Test user" badge
- ❌ Admin panel access
- ❌ Any indication they got free access

**Only you see they're test users** (in admin dashboard).

---

## SECURITY

1. **Password-protected** - Admin panel requires password
2. **Token-based auth** - Session token expires after 24 hours
3. **Separate table** - Test users don't mix with real customers
4. **Easy revocation** - Delete access with one click
5. **Audit trail** - See when each user was added

---

## USE CASES

### **Testing:**
- Add your own email
- Test entire portal flow
- Verify PDF viewers work
- Check AI chatbot
- Make sure everything functions

### **Friends/Family:**
- Give free access to mom, dad, siblings
- They can use the full product
- No payment required
- Revoke anytime if needed

### **Beta Testers:**
- Recruit 10-20 beta testers
- Give them Quick-Start or Archive access
- Collect feedback
- Revoke after testing period

### **Content Creators:**
- Give access to YouTubers for reviews
- Influencers can try it free
- Get testimonials/reviews
- Track who you gave access to

---

## DESIGN (MATCHES LANDING PAGE)

**Colors:**
- Background: #0a0a0a (pure black)
- Cards: #1a1a1a (dark gray)
- Borders: #333333
- Primary: #14B8A6 (teal)
- Danger: #ef4444 (red - for delete)
- Text: #ffffff, #d1d5db, #9ca3af

**Fonts:**
- Inter (matches landing page)

**Style:**
- Clean, minimal, professional
- Dark gothic aesthetic
- Clear hierarchy
- Mobile responsive

---

## REPLIT BUILD INSTRUCTION

```
BUILD ADMIN PANEL FOR TEST USER MANAGEMENT

URL: /admin

PAGES:

1. /admin (login page)
   - Password input
   - Submit button
   - Error message if wrong password
   - Redirects to /admin/dashboard on success

2. /admin/dashboard (main panel)
   - Header with logout button
   - Stats cards (total users, by access level)
   - Add user form (email, access level, note)
   - Users table (all test users)
   - Delete button for each user

API ENDPOINTS:

1. POST /api/admin/login
   - Verify password against ADMIN_PASSWORD env variable
   - Return session token

2. POST /api/admin/add-test-user
   - Requires admin token
   - Insert into test_users table
   - Return success

3. GET /api/admin/test-users
   - Requires admin token
   - Return all test users

4. DELETE /api/admin/test-user/:id
   - Requires admin token
   - Delete from test_users table

PORTAL LOGIN UPDATE:

Update POST /api/portal/login to:
1. Check test_users table first
2. If found, grant access based on access_level
3. Otherwise check purchases table
4. If neither, return error

DATABASE:

CREATE TABLE test_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  access_level VARCHAR(50) NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

DESIGN:
- Match landing page aesthetic (dark, teal, Inter font)
- Mobile responsive
- Professional admin UI
- Clean, functional, no clutter

ACCESS LEVELS:
- crash-course: Free tier only
- quick-start: Crash Course + Quick-Start
- archive: Everything (all products)

ADMIN PASSWORD:
Read from environment variable: ADMIN_PASSWORD
If not set, use default: "PatternArchivist2026!"
(But recommend setting secure password in Secrets)

Build this exactly as specified.
All UI code provided in separate file.
```

---

## WHAT THIS GETS YOU

✅ **Test everything yourself** - Add your email, full access  
✅ **Give to friends/family** - Free access without payment  
✅ **Manage beta testers** - Add/remove easily  
✅ **No Stripe needed** - Bypass payment system  
✅ **Track who has access** - See all test users  
✅ **Revoke anytime** - One-click delete  
✅ **Professional admin panel** - Real product feel  

---

**This is production-ready. Hand to Replit and build it.**
