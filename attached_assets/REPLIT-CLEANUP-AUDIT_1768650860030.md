# PRE-LAUNCH CLEANUP & AUDIT
## The Archivist Method - Final Sanity Check

---

## OBJECTIVE

Before launching the new landing page, perform a comprehensive cleanup to:
- Remove old/unused files
- Fix broken links
- Delete obsolete code
- Verify all assets are used
- Ensure no conflicts between old and new versions
- Clean up any test/debug code

**This prevents bugs, confusion, and broken user experiences.**

---

## PHASE 1: FILE INVENTORY & CLEANUP

### **1. Identify ALL Files in Project**

List every file currently in the project:
```
/
├── index.html (or equivalent homepage)
├── /assets
│   ├── /images
│   ├── /css
│   └── /js
├── /pages
│   ├── /quiz
│   ├── /portal
│   └── /pricing (if exists)
└── ...
```

### **2. Identify REQUIRED Files (Keep These)**

**Homepage:**
- `index.html` or root landing page
- CSS for landing page
- JavaScript for animations/interactions
- Hero background image (library)
- Logo files

**Quiz System:**
- Quiz page (`/quiz` or `/assessment`)
- Quiz logic/scoring
- 7 result pages (or result generator)
- Email capture form

**Portal:**
- Portal login page
- Portal dashboard
- Crash course content pages
- User authentication

**Assets:**
- Fonts (Bebas Neue, Inter - if self-hosted)
- Brand colors/design tokens
- Icons (if any)

**Legal:**
- Terms of Service page
- Privacy Policy page
- Refund Policy page (if exists)

### **3. Identify OBSOLETE Files (Delete These)**

**Old Landing Page Versions:**
- Any `index-old.html` or `landing-v1.html`
- Old hero images not being used
- Previous pricing page (if replaced by Founding Member)
- Old CSS files with "v1" or "old" in name

**Test/Debug Files:**
- `test.html`
- `debug.js`
- `temp.css`
- Any files with "draft" or "WIP" in name

**Unused Images:**
- Old hero backgrounds not being used
- Pattern card images if not implemented
- Unused icons or graphics
- Screenshots or mockups

**Duplicate Files:**
- Multiple versions of same component
- Backup files (`.bak`, `.old`, etc.)

### **4. Delete Obsolete Files**

Create a list of files to delete, then:
```bash
# Review list carefully, then delete
rm old-landing.html
rm assets/images/old-hero.jpg
rm css/landing-v1.css
# etc.
```

**IMPORTANT:** Make a backup before deleting anything critical.

---

## PHASE 2: LINK VERIFICATION

### **1. Check ALL Internal Links**

Verify every link on the landing page works:

**Navigation Links:**
- [ ] Header logo links to homepage
- [ ] "Method" link (if exists) goes to correct section
- [ ] "Contact" link works
- [ ] "Portal Login" goes to portal
- [ ] Footer links all work

**CTA Links (CRITICAL):**
- [ ] Hero CTA → `/quiz` or `/assessment` (VERIFY PATH)
- [ ] Pattern section CTA → `/quiz` or `/assessment`
- [ ] Origin section CTA → `/quiz` or `/assessment`
- [ ] Method section CTA → `/quiz` or `/assessment`
- [ ] Founding Member CTA → `/quiz` or `/assessment`
- [ ] Final CTA → `/quiz` or `/assessment`

**Legal Links:**
- [ ] Terms of Service → `/terms` or correct path
- [ ] Privacy Policy → `/privacy` or correct path
- [ ] Refund Policy → `/refund` or correct path (if exists)

### **2. Check External Links (If Any)**

If you link to external resources:
- [ ] Social media links (if present)
- [ ] External tools/resources
- [ ] Support/help center

### **3. Fix Broken Links**

Common issues:
```html
<!-- WRONG -->
<a href="/quiz">Take Quiz</a>
<!-- If quiz is actually at /assessment -->

<!-- CORRECT -->
<a href="/assessment">Take Quiz</a>
```

**Decision Needed:** Is your quiz at `/quiz` or `/assessment`?
Pick ONE and use it consistently across all CTAs.

---

## PHASE 3: IMAGE AUDIT

### **1. Verify All Images Load**

Check every image on the page:

**Hero Section:**
- [ ] Background library image loads
- [ ] Image is optimized (<200KB)
- [ ] WebP format with JPG fallback
- [ ] Image path is correct

**Logo:**
- [ ] Logo image loads in header
- [ ] Logo image loads in footer
- [ ] File path is correct
- [ ] Alt text present

**Pattern Cards:**
- [ ] If images used, all 7 load correctly
- [ ] If no images, confirm cards are text-only

### **2. Remove Unused Images**

Delete any images in `/assets/images/` that aren't referenced anywhere:
```bash
# Find unused images
# Check each image file against all HTML/CSS/JS
# Delete if not found anywhere
```

### **3. Optimize Image Sizes**

Ensure all images are properly compressed:
- Hero background: <200KB
- Logo: <50KB
- Icons: <20KB each

---

## PHASE 4: CSS CLEANUP

### **1. Identify CSS Files**

List all CSS files:
```
/assets/css/
├── main.css
├── landing.css (if separate)
├── components.css
└── ...
```

### **2. Remove Duplicate/Conflicting Styles**

**Common conflicts:**
```css
/* Old version */
.brand-title {
  font-family: 'Inter', sans-serif; /* WRONG FONT */
  font-size: 48px; /* OLD SIZE */
}

/* New version */
.brand-title {
  font-family: 'Bebas Neue', 'Oswald', sans-serif; /* CORRECT */
  font-size: 64px; /* NEW SIZE */
}
```

**Fix:** Delete old version, keep only new.

### **3. Remove Unused CSS Classes**

Delete CSS for components that no longer exist:
```css
/* If you removed detailed pricing cards */
.pricing-card-detailed { /* DELETE THIS */
  ...
}

/* If you removed navigation links */
.nav-menu { /* DELETE IF NOT USED */
  ...
}
```

### **4. Consolidate CSS Files**

If you have multiple CSS files, consider consolidating:
```
Before:
- landing.css
- landing-v2.css
- new-landing.css

After:
- main.css (consolidated, clean)
```

---

## PHASE 5: JAVASCRIPT CLEANUP

### **1. Identify JS Files**

List all JavaScript files:
```
/assets/js/
├── main.js
├── animations.js
├── quiz.js (separate quiz page)
└── ...
```

### **2. Remove Console Logs**

Delete all debug console logs:
```javascript
// DELETE THESE
console.log('Debug: user clicked button');
console.log('Testing animation');
console.warn('This is a test');

// KEEP THESE (important errors)
console.error('Critical error:', error);
```

### **3. Remove Test/Debug Code**

Delete any test functions or commented-out code:
```javascript
// DELETE
// function testAnimation() {
//   console.log('testing');
// }

// DELETE
const DEBUG_MODE = true;
if (DEBUG_MODE) {
  // test code
}
```

### **4. Verify Event Listeners**

Ensure all event listeners point to correct elements:
```javascript
// Check these work
document.querySelector('.cta-primary').addEventListener('click', ...);
document.querySelectorAll('.pattern-card').forEach(...);
```

### **5. Remove Unused Libraries**

If you imported libraries you're not using:
```html
<!-- DELETE if not using jQuery -->
<script src="jquery.min.js"></script>

<!-- DELETE if not using -->
<script src="unused-library.js"></script>
```

---

## PHASE 6: HTML STRUCTURE AUDIT

### **1. Check HTML Validity**

Run through W3C validator or check for:
- [ ] Proper DOCTYPE
- [ ] All tags closed properly
- [ ] No duplicate IDs
- [ ] Semantic HTML used
- [ ] Alt text on all images

### **2. Remove Old Sections**

Delete any HTML sections no longer needed:
```html
<!-- DELETE if you replaced with Founding Member -->
<section class="pricing-section-old">
  ...
</section>

<!-- DELETE if you removed nav links -->
<nav class="main-navigation">
  <a href="/about">About</a> <!-- Not needed -->
  <a href="/blog">Blog</a> <!-- Not needed -->
</nav>
```

### **3. Verify Section Order**

Confirm sections are in correct order:
1. Hero
2. Pattern Cards
3. The Origin
4. The Method
5. Founding Member Offer
6. Final CTA
7. Footer

### **4. Remove Commented-Out Code**

Delete all HTML comments that are old code:
```html
<!-- DELETE THESE -->
<!-- Old pricing section 
<div class="old-pricing">
  ...
</div>
-->

<!-- KEEP THESE (helpful notes) -->
<!-- Pattern Cards Section -->
```

---

## PHASE 7: ROUTING/PATH VERIFICATION

### **1. Verify All Routes Work**

Test these paths load correctly:
- [ ] `/` (homepage/landing)
- [ ] `/quiz` or `/assessment` (whichever you use)
- [ ] `/portal` or `/portal/login`
- [ ] `/terms`
- [ ] `/privacy`
- [ ] `/contact` (if exists)

### **2. Set Up Redirects (If Paths Changed)**

If you changed paths, add redirects:
```
Old: /pricing
New: / (Founding Member on homepage)
Redirect: /pricing → /

Old: /quiz
New: /assessment
Redirect: /quiz → /assessment
```

### **3. Check 404 Handling**

Verify invalid URLs show proper 404 page:
- [ ] `/random-page` shows 404
- [ ] 404 page has link back to homepage

---

## PHASE 8: FONT VERIFICATION

### **1. Confirm Fonts Load**

Check both fonts load properly:
- [ ] Bebas Neue loads (for brand title)
- [ ] Inter loads (for body text)

### **2. Remove Old Font Files**

If you switched fonts, delete old ones:
```
Before: Arial, Helvetica (defaults)
After: Bebas Neue, Inter

Action: Remove any custom font files for Arial/Helvetica if self-hosted
```

### **3. Verify Fallbacks**

Ensure font stack has fallbacks:
```css
font-family: 'Bebas Neue', 'Oswald', sans-serif; /* ✓ Has fallback */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; /* ✓ */
```

---

## PHASE 9: ANIMATION VERIFICATION

### **1. Test Archival Reveal Animation**

On page load:
- [ ] Brand title slides up from below
- [ ] Timing: Starts at 0.3s, duration 1.2s
- [ ] Tagline fades in after
- [ ] Animation completes at ~1.8s
- [ ] No janky motion

### **2. Test Scroll Animations**

As you scroll down:
- [ ] Pattern cards fade in with stagger
- [ ] Section headlines fade in
- [ ] No layout shift (CLS)
- [ ] Smooth 60fps

### **3. Test Hover Animations**

Hover over buttons:
- [ ] CTAs lift slightly
- [ ] Pink underglow appears
- [ ] Smooth transition
- [ ] No lag

### **4. Test Reduced Motion**

Turn on "Reduce Motion" in OS settings:
- [ ] Animations disable
- [ ] Content still visible
- [ ] No broken layouts

---

## PHASE 10: MOBILE VERIFICATION

### **1. Test on Actual Devices**

**iPhone (or iOS device):**
- [ ] Page loads correctly
- [ ] Animations work
- [ ] Touch targets are big enough (44px+)
- [ ] Text is readable
- [ ] CTAs work
- [ ] No horizontal scroll

**Android device:**
- [ ] Page loads correctly
- [ ] Animations work
- [ ] Everything functional
- [ ] No layout issues

### **2. Test Responsive Breakpoints**

**Desktop (1920px):**
- [ ] Full layout displays properly
- [ ] All sections visible
- [ ] Spacing correct

**Laptop (1440px):**
- [ ] Layout adapts properly
- [ ] No overflow issues

**Tablet (768px):**
- [ ] Pattern cards stack if needed
- [ ] Fonts resize appropriately
- [ ] Touch-friendly

**Mobile (375px):**
- [ ] Single column layout
- [ ] Full-width CTAs
- [ ] Readable text
- [ ] No zoom required

---

## PHASE 11: PERFORMANCE CHECK

### **1. Run Lighthouse Audit**

In Chrome DevTools → Lighthouse:
- [ ] Performance score >90
- [ ] Accessibility score >95
- [ ] Best Practices score >90
- [ ] SEO score >90

### **2. Check Load Times**

Test page load speed:
- [ ] First Contentful Paint <1.5s
- [ ] Largest Contentful Paint <2.5s
- [ ] Time to Interactive <3.5s

### **3. Check File Sizes**

Verify asset sizes:
- [ ] Total CSS <100KB
- [ ] Total JS <150KB
- [ ] Total images <500KB
- [ ] Hero image <200KB

### **4. Optimize if Needed**

If performance is poor:
- Compress images further
- Minify CSS/JS
- Remove unused code
- Enable caching

---

## PHASE 12: SECURITY & BEST PRACTICES

### **1. Remove Sensitive Data**

Delete any test data:
- [ ] No API keys in code
- [ ] No test email addresses
- [ ] No debug URLs
- [ ] No personal info in comments

### **2. Check Form Security**

If email capture exists:
- [ ] CSRF protection
- [ ] Input validation
- [ ] Sanitization
- [ ] Rate limiting

### **3. Update Dependencies**

If using npm/yarn packages:
```bash
npm audit
npm update
```

---

## PHASE 13: CONTENT VERIFICATION

### **1. Verify All Copy Matches Spec**

Check every section against FINAL-MASTER-IMPLEMENTATION.md:
- [ ] Hero copy exact
- [ ] Pattern cards exact (all 7)
- [ ] Origin section exact
- [ ] Method section exact
- [ ] Founding Member offer exact
- [ ] Final CTA exact
- [ ] Footer exact

### **2. Check for Typos**

Run spell check on:
- [ ] Headlines
- [ ] Body copy
- [ ] Button text
- [ ] Footer text

### **3. Verify Pink Usage**

Confirm pink appears ONLY on:
- [ ] "NOT" in tagline
- [ ] CTA button hover (subtle underglow)
- [ ] Footer links on hover

**Pink should NOT appear:**
- ❌ In headlines
- ❌ In body text
- ❌ On pattern cards
- ❌ Anywhere else

---

## PHASE 14: FINAL CROSS-BROWSER TEST

### **1. Test in All Major Browsers**

**Chrome:**
- [ ] Everything works
- [ ] Animations smooth
- [ ] No errors

**Firefox:**
- [ ] Everything works
- [ ] Animations smooth
- [ ] No errors

**Safari (Mac/iOS):**
- [ ] Everything works
- [ ] Animations smooth
- [ ] No errors
- [ ] Fonts load correctly

**Edge:**
- [ ] Everything works
- [ ] Animations smooth
- [ ] No errors

### **2. Check Console Errors**

In each browser, open console:
- [ ] No JavaScript errors
- [ ] No 404 errors (missing files)
- [ ] No CSS warnings

---

## PHASE 15: ANALYTICS & TRACKING

### **1. Verify Analytics Setup**

If using Google Analytics or similar:
- [ ] Tracking code present
- [ ] Tracking ID correct
- [ ] Events tracked (CTA clicks)
- [ ] Test tracking works

### **2. Set Up Conversion Events**

Track these critical events:
- [ ] Hero CTA click
- [ ] Pattern card engagement
- [ ] Founding Member CTA click
- [ ] Assessment started
- [ ] Assessment completed
- [ ] Email captured

---

## FINAL CLEANUP CHECKLIST

### **Files:**
- [ ] Deleted all obsolete files
- [ ] Removed duplicate files
- [ ] Cleaned up file structure
- [ ] No test/debug files remain

### **Links:**
- [ ] All internal links work
- [ ] All CTAs go to correct destination
- [ ] No broken links
- [ ] Legal links work

### **Images:**
- [ ] All images load correctly
- [ ] Unused images deleted
- [ ] Images optimized
- [ ] Alt text present

### **Code:**
- [ ] CSS cleaned up (no duplicates)
- [ ] JS cleaned up (no console.logs)
- [ ] HTML valid
- [ ] No commented-out code

### **Content:**
- [ ] Copy matches spec exactly
- [ ] No typos
- [ ] Pink used correctly (NOT + hover only)
- [ ] All sections present

### **Functionality:**
- [ ] Animations work (Archival Reveal)
- [ ] Hover states work
- [ ] Forms work (if any)
- [ ] Mobile responsive

### **Performance:**
- [ ] Page loads fast (<3s)
- [ ] Lighthouse scores good
- [ ] No layout shift
- [ ] 60fps animations

### **Cross-Platform:**
- [ ] Works on desktop
- [ ] Works on mobile
- [ ] Works in all browsers
- [ ] Reduced motion respected

---

## REPLIT COMMAND

```
PERFORM COMPREHENSIVE PRE-LAUNCH CLEANUP & AUDIT

Follow these phases in order:

PHASE 1: FILE CLEANUP
- List all files in project
- Identify obsolete files (old landing pages, test files, unused images)
- Delete obsolete files after confirmation
- Organize remaining files

PHASE 2: LINK VERIFICATION
- Check every CTA links to correct destination (/quiz or /assessment)
- Verify navigation links work
- Check footer links work
- Fix any broken links

PHASE 3: IMAGE AUDIT
- Verify all images load
- Check hero background (<200KB)
- Remove unused images
- Verify alt text present

PHASE 4: CSS CLEANUP
- Remove duplicate styles
- Delete conflicting old CSS
- Remove unused classes
- Consolidate CSS files if needed

PHASE 5: JAVASCRIPT CLEANUP
- Remove all console.log() statements
- Delete test/debug code
- Remove commented-out code
- Verify event listeners work

PHASE 6: HTML AUDIT
- Remove old commented-out sections
- Verify section order correct
- Check HTML validity
- Remove unused sections

PHASE 7: VERIFY CRITICAL ELEMENTS
- Archival Reveal animation works (brand title slides up)
- Pattern cards scroll-animate with stagger
- Pink appears ONLY on "NOT" and CTA hover
- All copy matches FINAL-MASTER-IMPLEMENTATION.md

PHASE 8: MOBILE TEST
- Test responsive design
- Verify touch targets 44px+
- Check animations on mobile
- Ensure no horizontal scroll

PHASE 9: PERFORMANCE CHECK
- Run Lighthouse audit
- Check load times
- Optimize if needed
- Verify <3s load time

PHASE 10: FINAL VERIFICATION
- All CTAs link to same destination (pick /quiz or /assessment)
- No console errors
- No broken links
- No 404s
- Ready to launch

Provide report of:
- Files deleted
- Links fixed
- Issues found and resolved
- Final status (ready/not ready to launch)
```

---

## AFTER CLEANUP

Once cleanup is complete, you should have:

✅ **Clean file structure** (no old/test files)  
✅ **All links working** (especially CTAs)  
✅ **Optimized images** (fast loading)  
✅ **Clean code** (no duplicates or debug code)  
✅ **Working animations** (Archival Reveal + scrolls)  
✅ **Mobile responsive** (tested on devices)  
✅ **Fast performance** (<3s load)  
✅ **No errors** (console clean)  
✅ **Ready to launch** (confidence, not confusion)

---

## WHY THIS MATTERS

**Without cleanup:**
- Old files conflict with new code
- Broken links frustrate users
- Slow load times lose conversions
- Debug code looks unprofessional
- Mobile experience broken
- Launch with bugs

**With cleanup:**
- Clean, professional codebase
- Everything works perfectly
- Fast, smooth experience
- No confusion or conflicts
- Confident launch
- Users have great experience

---

**This is your final sanity check before launch.**

**Do this cleanup. Then ship with confidence.**
