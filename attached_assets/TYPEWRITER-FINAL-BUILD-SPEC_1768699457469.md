# TYPEWRITER ANIMATION - FINAL BUILD SPEC
## Option 2: Classic Typewriter + Pink Emphasis

---

## WHAT WE'RE BUILDING:

Hero headline that types out letter-by-letter with pink cursor and pink emphasis on key words.

**Text:**
```
Stop Running the Same Destructive Patterns
```

**Pink elements:**
- "Same Destructive" (pink text)
- Blinking cursor (pink)

---

## HTML STRUCTURE:

```html
<div class="hero-content">
  <!-- Brand lockup (already exists) -->
  <div class="brand-lockup">
    <h1 class="brand-title">THE ARCHIVIST METHOD™</h1>
    <p class="brand-tagline">Pattern Archaeology, <span class="not">Not</span> Therapy</p>
  </div>
  
  <!-- Typewriter headline (NEW) -->
  <h2 class="hero-headline">
    <span class="typewriter-container">
      <span class="typewriter-text">Stop Running the <span class="pink-text">Same Destructive</span> Patterns</span>
    </span>
  </h2>
  
  <!-- Subhead (already exists) -->
  <p class="hero-subhead">
    You watch yourself do it. You know it's happening. You do it anyway.
  </p>
  
  <!-- CTA (already exists) -->
  <a href="/quiz" class="cta-primary">
    Take the Pattern Assessment →
  </a>
</div>
```

---

## CSS:

```css
.hero-headline {
  font-family: 'Inter', sans-serif;
  font-size: 48px;
  font-weight: 700;
  color: #ffffff;
  margin: 40px 0 24px;
  line-height: 1.2;
  min-height: 120px; /* Prevent layout shift during animation */
  text-align: center;
}

.typewriter-container {
  display: inline-block;
}

.typewriter-text {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid #EC4899; /* Pink blinking cursor */
  padding-right: 8px;
  animation: 
    typing 3s steps(44) 1.5s forwards, /* 44 characters total */
    blink-cursor 0.75s step-end infinite 1.5s;
  width: 0; /* Start with 0 width */
}

/* Pink emphasis on key words */
.typewriter-text .pink-text {
  color: #EC4899;
}

/* Typing animation */
@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

/* Blinking cursor */
@keyframes blink-cursor {
  from, to {
    border-color: transparent;
  }
  50% {
    border-color: #EC4899;
  }
}

/* Remove cursor after typing completes */
.typewriter-text.typing-complete {
  border-right: none;
  animation: none;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .hero-headline {
    font-size: 36px;
    min-height: 90px;
  }
  
  .typewriter-text {
    animation: 
      typing 2s steps(44) 1s forwards, /* Faster on mobile */
      blink-cursor 0.75s step-end infinite 1s;
  }
}

/* Accessibility - reduced motion */
@media (prefers-reduced-motion: reduce) {
  .typewriter-text {
    animation: none !important;
    width: 100% !important;
    border-right: none !important;
  }
}
```

---

## JAVASCRIPT:

```javascript
// Remove cursor after typing animation completes
document.addEventListener('DOMContentLoaded', () => {
  const typewriterElement = document.querySelector('.typewriter-text');
  
  if (typewriterElement) {
    // Desktop: 1.5s delay + 3s typing = 4.5s
    // Mobile: 1s delay + 2s typing = 3s
    const isMobile = window.innerWidth <= 768;
    const completionTime = isMobile ? 3000 : 4500;
    
    setTimeout(() => {
      typewriterElement.classList.add('typing-complete');
    }, completionTime);
  }
});
```

---

## ANIMATION TIMELINE:

```
0.0s - Page loads
       → Particles start floating
       → Background visible

0.3s - Brand title animation starts
       → "THE ARCHIVIST METHOD™" slides up

1.0s - Tagline animation starts
       → "Pattern Archaeology, Not Therapy" fades in

1.5s - Typewriter animation starts (DESKTOP)
       → Cursor starts blinking
       → Text begins typing letter-by-letter
       → "Same Destructive" appears in pink as it types

4.5s - Typing completes (DESKTOP)
       → Cursor disappears
       → Full headline visible

5.0s - Subhead appears
       → "You watch yourself do it..."

5.5s - CTA appears
       → "Take the Pattern Assessment" button visible

MOBILE TIMELINE (FASTER):
1.0s - Typewriter starts (earlier)
3.0s - Typing completes (faster)
```

---

## VISUAL EFFECT:

**What user sees:**

1. Brand lockup animates in
2. After brief pause, headline starts typing:
   ```
   S|
   St|
   Sto|
   Stop|
   Stop |
   Stop R|
   Stop Ru|
   ...
   Stop Running the Same Destructive Patterns|
                       ↑ Pink      ↑ Pink cursor blinks
   ```
3. Cursor disappears
4. Rest of hero content appears

**Premium, clean, on-brand.**

---

## INTEGRATION WITH EXISTING ANIMATIONS:

**Hero section has these animations:**

1. ✅ **Archival Reveal** (brand lockup) - Keep
2. ✅ **Floating particles** - Keep
3. ✅ **NEW: Typewriter headline** - Add
4. ✅ **Subhead fade-in** (if exists) - Keep
5. ✅ **CTA fade-in** (if exists) - Keep

**They all work together in sequence.**

---

## FALLBACKS:

### **If JavaScript Fails:**
CSS animation still runs, cursor just doesn't disappear (acceptable fallback)

### **If User Has Reduced Motion Enabled:**
Text appears instantly (no animation)

### **On Slow Connections:**
Animation still works (it's CSS-based, lightweight)

---

## TESTING CHECKLIST:

After Replit builds this:

**Desktop:**
- [ ] Does headline start typing at 1.5s?
- [ ] Does typing take ~3 seconds?
- [ ] Is "Same Destructive" pink?
- [ ] Does cursor blink pink?
- [ ] Does cursor disappear after completion?
- [ ] Does it work in Chrome, Safari, Firefox?

**Mobile:**
- [ ] Does headline start typing at 1s?
- [ ] Does typing take ~2 seconds (faster)?
- [ ] Is animation smooth (no jank)?
- [ ] Does it work on iPhone/Android?

**Accessibility:**
- [ ] Enable "Reduce Motion" in OS
- [ ] Does headline appear instantly (no animation)?
- [ ] Is text still readable?

---

## REPLIT BUILD INSTRUCTION:

```
ADD TYPEWRITER ANIMATION TO HERO HEADLINE

Location: Hero section, main headline
Text: "Stop Running the Same Destructive Patterns"

Animation Type: Classic Typewriter + Pink Emphasis

Implementation:
1. Add HTML structure (see spec)
2. Add CSS animations (typing + cursor blink)
3. Add JavaScript (remove cursor after completion)
4. Pink text on "Same Destructive"
5. Pink blinking cursor (#EC4899)

Timeline:
- Desktop: Start at 1.5s, complete at 4.5s (3s typing)
- Mobile: Start at 1s, complete at 3s (2s typing)

Integrates with:
- Existing Archival Reveal animation (brand lockup)
- Floating particles
- Pattern cards scroll animation

Fallbacks:
- Reduced motion: Instant appearance
- JavaScript disabled: Animation still runs, cursor stays (acceptable)

All code provided in specification file.
Test on desktop AND mobile.
Ensure smooth performance.

Build now.
```

---

## WHAT YOU'LL SEE WHEN IT'S LIVE:

**Desktop experience:**
1. Page loads with particles floating
2. Brand title slides up elegantly
3. Tagline fades in
4. **Headline starts typing out** ← NEW
5. Pink cursor blinks as it types
6. "Same Destructive" appears in pink
7. Typing finishes, cursor disappears
8. Subhead and CTA appear

**Feels premium, polished, alive.**

---

**Hand this to Replit and see it live.**

**If you don't like it, we can switch to Scramble or another option.**
