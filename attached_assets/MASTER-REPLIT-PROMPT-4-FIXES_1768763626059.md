# MASTER REPLIT PROMPT - 4 CRITICAL GEMINI FIXES
## All Remaining Launch Blockers in One Build

---

## COPY THIS ENTIRE PROMPT TO REPLIT:

```
CRITICAL LAUNCH BLOCKERS - 4 FIXES

Priority: 🔴 BLOCKS LAUNCH
Timeline: Complete all 4 fixes in this session
Test: Verify all fixes work before marking complete

---

FIX #1: REMOVE "HEALING" LANGUAGE (15 MIN)
========================================

Issue: Brand violation - "healing/heal/thrive" language appears on site

Locations to search and fix:
1. Footer FAQ
2. Confirmation emails
3. Any other content

Action:
- Search entire codebase: grep -ri "healing" ./src
- Search: grep -ri "heal" ./src  
- Search: grep -ri "thrive" ./src
- Search: grep -ri "thrivers" ./src

Replace with approved language:
❌ "healing" → ✅ "reprogramming" or "interrupting"
❌ "heal" → ✅ "interrupt" or "decode"
❌ "thrive/thrivers" → ✅ "archive members" or remove entirely

Specific fixes:
- Footer FAQ Q3: "How long does the healing process take?"
  → Change to: "How long does the reprogramming window last?"
  
- Confirmation email: "Join our community of thrivers"
  → Change to: "Access granted. Join the archive."

Verify:
- Global search for "heal" returns ZERO results
- Global search for "thrive" returns ZERO results
- Footer FAQ uses pattern interruption language
- Email uses Archivist voice

---

FIX #2: MOBILE PRICING TABLE OVERFLOW (1 HOUR)
===============================================

Issue: On /portal/crash-course page, the 3-column pricing comparison table cuts off on mobile. 
The Archive ($197) column is not visible on iPhone (<390px width).

Location: /portal/crash-course pricing/upgrade section

Solution: Make table horizontally scrollable on mobile with visual scroll indicator

Implementation:

1. Wrap table in scroll container:
```jsx
<div className="pricing-comparison">
  <div className="table-scroll-container">
    <table className="comparison-table">
      {/* existing table content */}
    </table>
  </div>
  
  <div className="scroll-indicator">
    <span>← Swipe to see all tiers →</span>
  </div>
</div>
```

2. Add CSS:
```css
@media (max-width: 768px) {
  .table-scroll-container {
    overflow-x: auto;
    overflow-y: visible;
    -webkit-overflow-scrolling: touch;
    position: relative;
  }
  
  /* Gradient hint that content continues */
  .table-scroll-container::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 100%;
    background: linear-gradient(to left, rgba(10, 10, 10, 0.9), transparent);
    pointer-events: none;
  }
  
  .comparison-table {
    min-width: 600px; /* Prevent collapse */
  }
  
  .scroll-indicator {
    display: flex;
    justify-content: center;
    padding: 12px;
    color: #14B8A6;
    font-size: 14px;
  }
}

@media (min-width: 769px) {
  .scroll-indicator {
    display: none;
  }
}
```

Test:
- iPhone SE (375px): Can scroll to see Archive column
- iPhone 10 Pro Max (414px): Can scroll to see Archive column
- All 3 columns visible via horizontal scroll
- Scroll indicator shows on mobile
- Desktop: No scroll, all columns visible

---

FIX #3: PORTAL UPGRADE LINK BROKEN (2 HOURS)
===========================================

Issue: "Upgrade to Archive" button in portal redirects to homepage instead of checkout.
Users must re-navigate the entire sales funnel (friction = lost sales).

Location: Portal dashboard upgrade button/link

Current behavior:
- User clicks "Upgrade to Archive"
- Redirects to homepage
- User must find pricing, click again

Required behavior:
- User clicks "Upgrade to Archive"  
- Goes directly to Stripe checkout OR /upgrade/archive page
- Email pre-filled from logged-in session
- Smooth upgrade flow

Solution A (Preferred - Direct Stripe):

1. Update button:
```jsx
<button 
  onClick={handleUpgrade}
  className="upgrade-button"
>
  Upgrade to Archive - $197
</button>
```

2. Add handler:
```javascript
const handleUpgrade = async () => {
  setIsUpgrading(true);
  
  try {
    const response = await fetch('/api/checkout/create-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceId: process.env.NEXT_PUBLIC_ARCHIVE_PRICE_ID,
        userId: user.id,
        email: user.email,
        upgradeFrom: 'quick-start',
        successUrl: `${window.location.origin}/portal/dashboard?upgrade=success`,
        cancelUrl: `${window.location.origin}/portal/dashboard`,
      }),
    });
    
    const { sessionId } = await response.json();
    const stripe = await getStripe();
    await stripe.redirectToCheckout({ sessionId });
    
  } catch (error) {
    console.error('Upgrade failed:', error);
    setError('Could not initiate upgrade. Please try again.');
  } finally {
    setIsUpgrading(false);
  }
};
```

3. Add loading state:
```jsx
{isUpgrading ? (
  <>
    <LoadingSpinner />
    Processing...
  </>
) : (
  'Upgrade to Archive - $197'
)}
```

Solution B (Fallback - Static page):

If Stripe dynamic sessions are complex, change link to:
```jsx
<Link href="/upgrade/archive">
  Upgrade to Archive - $197
</Link>
```

Then create /upgrade/archive page with Stripe checkout form.

Test:
- Click "Upgrade to Archive" → Goes to Stripe checkout (not homepage)
- Email pre-filled in checkout
- After payment → Redirects to portal
- Access granted immediately (or within webhook delay)
- Cancel button → Returns to portal cleanly

---

FIX #4: ADMIN SESSION TIMEOUT MISSING (3 HOURS)
==============================================

Issue: Admin panel session does not expire. Admin can leave tab open overnight and still have full access without re-auth.

Security risk: HIGH (stolen/accessed laptop = unlimited admin access)

Solution: Implement 60-minute server-side token expiry + client-side auto-logout

Implementation:

1. Server-side token expiry:

Find: JWT token generation (likely /lib/auth.ts or /pages/api/auth/login.ts)

BEFORE:
```javascript
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET
);
```

AFTER:
```javascript
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '60m' } // 60 minutes for admin
);
```

2. Verify token on admin routes:

Find: middleware.ts or admin route protection

Add:
```javascript
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
      
      return NextResponse.next();
      
    } catch (error) {
      // Token expired or invalid
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('auth_token');
      return response;
    }
  }
  
  return NextResponse.next();
}
```

3. Client-side auto-logout:

Find: Admin layout component

Add:
```javascript
useEffect(() => {
  const TIMEOUT_DURATION = 60 * 60 * 1000; // 60 minutes
  let lastActivity = Date.now();
  
  const updateActivity = () => {
    lastActivity = Date.now();
  };
  
  const checkTimeout = setInterval(() => {
    if (Date.now() - lastActivity > TIMEOUT_DURATION) {
      // Auto logout
      fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/admin/login?reason=timeout';
    }
  }, 60000); // Check every minute
  
  window.addEventListener('mousemove', updateActivity);
  window.addEventListener('keydown', updateActivity);
  window.addEventListener('click', updateActivity);
  
  return () => {
    clearInterval(checkTimeout);
    window.removeEventListener('mousemove', updateActivity);
    window.removeEventListener('keydown', updateActivity);
    window.removeEventListener('click', updateActivity);
  };
}, []);
```

Test:
- Admin logs in
- Wait 61 minutes with no activity
- Try to access admin page → Redirects to login
- Token is cleared from cookies
- Must re-login to access admin
- Regular user sessions longer (7 days) - only admin is 60 min

---

TESTING PROTOCOL
================

After completing all 4 fixes:

Desktop Tests:
- [ ] No "healing" language anywhere (search returns zero)
- [ ] Admin session expires after 60 min
- [ ] Upgrade button works (test with test Stripe mode)

Mobile Tests (iPhone 10 Pro Max):
- [ ] Pricing table scrolls horizontally
- [ ] All 3 tiers visible via scroll
- [ ] Scroll indicator shows

Portal Tests:
- [ ] Upgrade button goes to Stripe checkout (not homepage)
- [ ] Email pre-filled
- [ ] Payment flow works

Admin Tests:
- [ ] Session expires after 60 min inactivity
- [ ] Auto-logout works
- [ ] Must re-login after timeout

Edge Cases:
- [ ] Multiple admin tabs - all logout simultaneously
- [ ] Browser back/forward doesn't break flows
- [ ] Stripe cancel returns to portal cleanly

---

COMPLETION CHECKLIST
====================

Before marking complete:

- [ ] All 4 fixes implemented
- [ ] All tests passed
- [ ] No console errors
- [ ] No regressions (existing features still work)
- [ ] Mobile tested (at minimum Chrome DevTools iPhone simulation)
- [ ] Desktop tested (Chrome)

Estimated time: 6.25 hours total
- Fix 1: 15 min
- Fix 2: 1 hour
- Fix 3: 2 hours  
- Fix 4: 3 hours
- Testing: 15 min

Build all 4 fixes now. Report when complete with test results.
```
