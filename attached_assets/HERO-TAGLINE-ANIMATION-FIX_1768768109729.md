# HERO SECTION FIXES - TAGLINE + ANIMATION
## Make tagline bold/authoritative, replace matrix with typewriter

---

## COPY THIS TO REPLIT:

```
HERO SECTION POLISH - 2 FIXES

Location: Homepage hero section (main headline area)

---

FIX #1: TAGLINE STYLING (Make Bold & Authoritative)
===================================================

Issue: "Pattern Archaeology, Not Therapy" feels weak, minimized, small

Current state:
- Italicized (feels soft)
- Split color Teal/Pink (feels gimmicky)
- Smaller than it should be
- Doesn't command attention

Required state:
- Bold, strong, authoritative
- Single color (Teal OR White)
- Larger, more prominent
- Same visual weight as main headline
- No italics

Implementation:

Find: Hero tagline CSS (likely .hero-tagline or .hero-subtitle)

BEFORE (probably):
```css
.hero-tagline {
  font-size: 24px;
  font-style: italic;
  color: #14B8A6; /* with pink mixed in */
  font-weight: 400;
}
```

AFTER:
```css
.hero-tagline {
  font-size: 32px; /* Larger, more prominent */
  font-style: normal; /* NO ITALICS */
  font-weight: 700; /* Bold */
  color: #14B8A6; /* Solid teal, no split */
  letter-spacing: -0.02em; /* Tight, professional */
  text-transform: none; /* Keep as-is: "Pattern Archaeology, Not Therapy" */
  margin-top: 16px;
  margin-bottom: 24px;
}

/* Mobile */
@media (max-width: 640px) {
  .hero-tagline {
    font-size: 24px;
    font-weight: 700;
  }
}
```

Alternative color option (if Teal feels too bright):
```css
color: #ffffff; /* White - clean, authoritative */
```

Visual hierarchy should be:
1. THE ARCHIVIST METHOD™ (largest, white, 700 weight)
2. Pattern Archaeology, Not Therapy (large, teal, 700 weight)
3. Stop Running the Same Destructive Patterns (medium, white, 600 weight)
4. Body text (smaller, slate gray, 400 weight)

Test:
- Tagline is bold, not italic
- Feels authoritative (not soft/minimized)
- Single color (teal or white)
- Visually prominent
- Mobile: Still readable, still bold

---

FIX #2: REPLACE MATRIX ANIMATION WITH TYPEWRITER
================================================

Issue: Matrix "scramble" animation feels off-brand (too tech bro, too gimmicky)

Current: Text scrambles/decodes (Matrix style)
Required: Text types out character-by-character (typewriter style)

Why typewriter is better:
- Matches "archaeology" metaphor (revealing what's buried)
- Feels intentional, not flashy
- Professional, clean
- Less distracting

Implementation:

Find: Hero animation JavaScript (likely in hero component or page file)

REMOVE: Matrix/scramble animation code

ADD: Typewriter animation

Option A - Simple CSS Animation:
```css
.hero-headline {
  overflow: hidden;
  border-right: 2px solid #14B8A6; /* Cursor effect */
  white-space: nowrap;
  animation: typing 2s steps(30) 1s forwards, blink 0.75s step-end infinite;
}

@keyframes typing {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

@keyframes blink {
  50% {
    border-color: transparent;
  }
}
```

Option B - JavaScript Typewriter (More Control):
```javascript
useEffect(() => {
  const text = "THE ARCHIVIST METHOD™";
  const element = document.querySelector('.hero-headline');
  let index = 0;
  
  element.textContent = ''; // Start empty
  
  const typewriter = setInterval(() => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      index++;
    } else {
      clearInterval(typewriter);
    }
  }, 80); // 80ms per character = ~2.4s total
  
  return () => clearInterval(typewriter);
}, []);
```

Option C - Multiple Lines Typewriter (Advanced):
```javascript
useEffect(() => {
  const lines = [
    { element: '.hero-headline', text: 'THE ARCHIVIST METHOD™', delay: 0 },
    { element: '.hero-tagline', text: 'Pattern Archaeology, Not Therapy', delay: 2000 },
    { element: '.hero-subtitle', text: 'Stop Running the Same Destructive Patterns', delay: 4000 },
  ];
  
  lines.forEach(({ element, text, delay }) => {
    setTimeout(() => {
      const el = document.querySelector(element);
      if (!el) return;
      
      el.textContent = '';
      let index = 0;
      
      const typewriter = setInterval(() => {
        if (index < text.length) {
          el.textContent += text.charAt(index);
          index++;
        } else {
          clearInterval(typewriter);
        }
      }, 60);
    }, delay);
  });
}, []);
```

Recommended: Option B (single line typewriter for main headline only)
- Simple, clean
- Not too distracting
- Professional
- Fast enough (~2.4 seconds)

Speed recommendations:
- Too fast (<50ms per char) = looks glitchy
- Too slow (>100ms per char) = user waits too long
- Sweet spot: 60-80ms per character

Test:
- Headline types out character-by-character
- Speed feels natural (not too fast, not too slow)
- Animation runs once on page load
- After animation completes, text stays (doesn't loop)
- Mobile: Animation still works
- No layout shift during animation

---

VISUAL COMPARISON
=================

BEFORE:
- Tagline: italic, small, split teal/pink
- Animation: Matrix scramble (flashy, tech bro)

AFTER:
- Tagline: bold, prominent, solid teal or white
- Animation: Typewriter (clean, archaeological, professional)

---

BRAND ALIGNMENT
===============

Typewriter animation matches The Archivist voice because:
- Reveals information deliberately (like excavation)
- Clinical, intentional (not flashy)
- Suggests careful observation (not chaos)
- Professional, authoritative (not gimmicky)

The matrix scramble felt like:
- Tech startup trying too hard
- Gimmicky, not serious
- Didn't match "archaeology" metaphor
- Too chaotic for clinical positioning

---

COMPLETION CHECKLIST
====================

- [ ] Tagline is bold (font-weight: 700)
- [ ] Tagline is NOT italic
- [ ] Tagline is prominent (larger size)
- [ ] Tagline is single color (teal or white)
- [ ] Matrix animation removed
- [ ] Typewriter animation added
- [ ] Animation speed feels natural (60-80ms/char)
- [ ] Mobile: Both fixes work
- [ ] No layout shift
- [ ] No console errors

Build both fixes now. Test on desktop and mobile.
```
