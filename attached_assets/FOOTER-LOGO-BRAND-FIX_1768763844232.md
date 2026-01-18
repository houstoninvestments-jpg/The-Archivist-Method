# FOOTER LOGO FIX - BRAND CONSISTENCY
## Make footer logo match hero with same authority

---

## COPY THIS TO REPLIT:

```
FOOTER LOGO STYLING FIX

Issue: Footer logo uses wrong font/styling, doesn't match brand

Location: Footer section (bottom of page)

---

CURRENT STATE (WRONG):
- Generic font (not matching hero)
- "NOT THERAPY" in red/pink (inconsistent)
- Feels weak, afterthought
- No visual authority

REQUIRED STATE:
- Same font as hero logo
- Brand colors consistent (Teal #14B8A6)
- Strong, authoritative even at small size
- Matches main logo exactly

---

IMPLEMENTATION:

Find: Footer logo component (likely .footer-logo or .footer-brand)

BEFORE (probably):
```css
.footer-brand {
  font-family: Arial, sans-serif; /* Generic */
  font-size: 18px;
  font-weight: 500;
}

.footer-tagline {
  color: #EC4899; /* Pink/Red - wrong */
}
```

AFTER:
```css
.footer-brand {
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 700; /* Bold, strong */
  letter-spacing: 0.5px; /* Spaced, authoritative */
  color: #ffffff;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.footer-tagline {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #14B8A6; /* Teal, NOT red/pink */
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* If using separate elements for PATTERN ARCHAEOLOGY, NOT THERAPY */
.footer-tagline .not-therapy {
  color: #14B8A6; /* Same teal, not red */
}
```

HTML structure should be:
```html
<div class="footer-brand-section">
  <div class="footer-brand">
    THE ARCHIVIST METHOD™
  </div>
  <div class="footer-tagline">
    PATTERN ARCHAEOLOGY, NOT THERAPY
  </div>
</div>
```

Brand consistency rules:
- Main logo font: Inter, 700 weight
- Footer logo font: Inter, 700 weight (SAME)
- Main tagline color: Teal #14B8A6
- Footer tagline color: Teal #14B8A6 (SAME)
- NO red/pink in "NOT THERAPY" anywhere

---

COMPLETE FOOTER STYLING:

```css
.footer {
  background: #0a0a0a;
  border-top: 1px solid rgba(20, 184, 166, 0.1);
  padding: 60px 20px 40px;
}

.footer-brand-section {
  text-align: center;
  margin-bottom: 40px;
}

.footer-brand {
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #ffffff;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.footer-tagline {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #14B8A6; /* All teal, no red */
  text-transform: uppercase;
  letter-spacing: 1px;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 24px;
}

.footer-link {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #94A3B8; /* Slate gray */
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #14B8A6; /* Teal on hover */
}

.footer-copyright {
  text-align: center;
  font-size: 13px;
  color: #6B7280;
  margin-top: 24px;
}
```

---

VISUAL HIERARCHY (Footer):

1. THE ARCHIVIST METHOD™ (white, bold, 20px)
2. PATTERN ARCHAEOLOGY, NOT THERAPY (teal, bold, 14px)
3. Footer links (slate gray, 14px)
4. Copyright (dark gray, 13px)

---

BRAND COLOR USAGE RULES:

✅ DO:
- Use Teal (#14B8A6) for tagline "NOT THERAPY"
- Use White (#ffffff) for main logo text
- Use Slate Gray (#94A3B8) for body text/links
- Keep consistent across header and footer

❌ DON'T:
- Use red/pink for "NOT THERAPY" (off-brand)
- Mix multiple colors in tagline
- Use default fonts (Arial, Times, etc)
- Make footer logo weaker than header

---

TESTING:

- [ ] Footer logo uses Inter font (same as hero)
- [ ] Footer logo is bold (700 weight)
- [ ] "NOT THERAPY" is TEAL, not red/pink
- [ ] Footer matches header brand authority
- [ ] Mobile: Footer logo still readable
- [ ] Colors consistent throughout site
- [ ] No default fonts anywhere

---

COMPLETION:

The footer should feel like it was designed by the same person who designed the header.

Same fonts. Same colors. Same authority.

Even at smaller size, the brand strength should be evident.

Build now.
```
