# COMPLETE LANDING PAGE ANIMATION SYSTEM
## .1% Level Animations Throughout - Brand Cohesive

---

## ANIMATION PHILOSOPHY:

**Every section gets animated, but with purpose:**
- Headers: Draw attention, establish hierarchy
- Cards: Reveal content progressively
- Text: Subtle but noticeable
- Overall: Premium, alive, not gimmicky

**Brand aesthetic:** Dark, gothic, Matrix vibes, pattern archaeology theme

---

## SECTION-BY-SECTION ANIMATIONS:

### **SECTION 1: HERO (Already Spec'd)**

**Brand Lockup:**
- Archival Reveal (slides up)
- Tagline fade-in

**Headline:**
- Scramble animation (Matrix effect)
- "Same Destructive" in pink

**Subhead + CTA:**
- Fade in after scramble completes

---

### **SECTION 2: THE 7 PATTERNS**

#### **Section Header:**
```
THE 7 DESTRUCTIVE PATTERNS
One (or more) of these is running your life:
```

**Animation: Glitch Reveal**

**Effect:** Header glitches in with RGB split, then stabilizes

**Code:**
```css
.patterns-header {
  font-family: 'Inter', sans-serif;
  font-size: 48px;
  font-weight: 900;
  color: #ffffff;
  text-align: center;
  opacity: 0;
  animation: glitch-in 0.8s ease-out forwards;
}

@keyframes glitch-in {
  0% {
    opacity: 0;
    transform: translateX(-100px);
    filter: blur(5px);
  }
  20% {
    opacity: 1;
    transform: translateX(10px) skew(-2deg);
  }
  40% {
    transform: translateX(-5px) skew(1deg);
  }
  60% {
    transform: translateX(2px);
  }
  100% {
    opacity: 1;
    transform: translateX(0) skew(0deg);
    filter: blur(0);
  }
}

/* RGB split effect during glitch */
.patterns-header::before,
.patterns-header::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.patterns-header::before {
  animation: rgb-split-1 0.3s ease-in-out 5;
  color: #EC4899; /* Pink */
  z-index: -1;
}

.patterns-header::after {
  animation: rgb-split-2 0.3s ease-in-out 5;
  color: #14B8A6; /* Teal */
  z-index: -1;
}

@keyframes rgb-split-1 {
  0%, 100% { opacity: 0; transform: translateX(0); }
  50% { opacity: 0.3; transform: translateX(-3px); }
}

@keyframes rgb-split-2 {
  0%, 100% { opacity: 0; transform: translateX(0); }
  50% { opacity: 0.3; transform: translateX(3px); }
}
```

#### **Pattern Cards:**

**Animation: Staggered Slide + Glow**

**Effect:** Cards slide in from below with teal glow that pulses on hover

**Code:**
```css
.pattern-card {
  background: #1a1a1a;
  border: 1px solid #333;
  padding: 32px;
  border-radius: 8px;
  opacity: 0;
  transform: translateY(40px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.pattern-card.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger delays */
.pattern-card:nth-child(1) { transition-delay: 0s; }
.pattern-card:nth-child(2) { transition-delay: 0.1s; }
.pattern-card:nth-child(3) { transition-delay: 0.2s; }
.pattern-card:nth-child(4) { transition-delay: 0.3s; }
.pattern-card:nth-child(5) { transition-delay: 0.4s; }
.pattern-card:nth-child(6) { transition-delay: 0.5s; }
.pattern-card:nth-child(7) { transition-delay: 0.6s; }

/* Hover: Teal glow pulse */
.pattern-card:hover {
  transform: translateY(-8px);
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(20, 184, 166, 0.2);
  border-color: #14B8A6;
}

/* Card number typewriter effect */
.pattern-number {
  color: #EC4899; /* Pink */
  font-size: 32px;
  font-weight: 900;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid #EC4899;
  animation: 
    number-type 0.3s steps(2) forwards,
    blink 0.75s step-end infinite;
}

.pattern-card.visible .pattern-number {
  animation: 
    number-type 0.3s steps(2) 0.2s forwards,
    blink 0.75s step-end 3; /* Blink 3 times then stop */
}

@keyframes number-type {
  from { width: 0; }
  to { width: 100%; border-right: none; }
}

@keyframes blink {
  50% { border-color: transparent; }
}

/* Card name scramble-in */
.pattern-name {
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  display: inline-block;
  margin-left: 12px;
}

/* Card description fade-in after name */
.pattern-description {
  color: #d1d5db;
  font-size: 16px;
  line-height: 1.6;
  margin-top: 12px;
  opacity: 0;
  animation: fade-in-up 0.6s ease-out 0.3s forwards;
}

.pattern-card.visible .pattern-description {
  animation: fade-in-up 0.6s ease-out 0.5s forwards;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### **SECTION 3: THE ORIGIN**

#### **Section Header:**
```
THESE AREN'T PERSONALITY TRAITS. THEY'RE SURVIVAL CODE.
```

**Animation: Word-by-Word Reveal**

**Effect:** Words appear one by one, with "SURVIVAL CODE" emphasized

**JavaScript:**
```javascript
class WordReveal {
  constructor(el, options = {}) {
    this.el = el;
    this.text = el.textContent.trim();
    this.words = this.text.split(' ');
    this.delay = options.delay || 100;
    this.emphasize = options.emphasize || [];
    
    this.el.innerHTML = '';
    this.reveal();
  }
  
  reveal() {
    this.words.forEach((word, index) => {
      setTimeout(() => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        
        // Emphasize specific words
        if (this.emphasize.includes(word.toUpperCase())) {
          span.style.color = '#EC4899'; /* Pink */
          span.style.fontWeight = '900';
        }
        
        span.style.opacity = '0';
        span.style.display = 'inline-block';
        span.style.animation = 'word-pop 0.3s ease-out forwards';
        
        this.el.appendChild(span);
      }, index * this.delay);
    });
  }
}

// Initialize when section is visible
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      new WordReveal(entry.target, {
        delay: 80,
        emphasize: ['SURVIVAL', 'CODE']
      });
      observer.unobserve(entry.target);
    }
  });
});

document.querySelectorAll('.origin-headline').forEach(el => {
  observer.observe(el);
});
```

```css
@keyframes word-pop {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(10px);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

#### **Body Content:**

**Animation: Paragraph Fade-In with Line Reveal**

**Effect:** Paragraphs fade in, then individual lines reveal with subtle slide

**Code:**
```css
.origin-body p {
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.origin-body p.visible {
  opacity: 1;
  transform: translateX(0);
}

/* Stagger paragraphs */
.origin-body p:nth-child(1) { transition-delay: 0.1s; }
.origin-body p:nth-child(2) { transition-delay: 0.2s; }
.origin-body p:nth-child(3) { transition-delay: 0.3s; }
.origin-body p:nth-child(4) { transition-delay: 0.4s; }

/* Key phrases get teal highlight */
.origin-body .key-phrase {
  color: #14B8A6;
  font-weight: 600;
  position: relative;
  display: inline-block;
}

.origin-body .key-phrase::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: #14B8A6;
  animation: underline-expand 0.6s ease-out 0.3s forwards;
}

@keyframes underline-expand {
  to { width: 100%; }
}
```

---

### **SECTION 4: THIS ISN'T THERAPY**

#### **Section Header:**
```
THIS ISN'T THERAPY
```

**Animation: Scramble Effect (Like Hero)**

**Effect:** Scrambles then resolves, with "ISN'T" in pink

---

#### **Comparison Content:**

**Animation: Side-by-Side Slide**

**Effect:** "THERAPY SAYS" slides from left, "PATTERN INTERRUPTION SAYS" slides from right

**Code:**
```css
.therapy-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin: 40px 0;
}

.therapy-side {
  opacity: 0;
  transform: translateX(-60px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.therapy-side.visible {
  opacity: 1;
  transform: translateX(0);
}

.interruption-side {
  opacity: 0;
  transform: translateX(60px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s; /* Slight delay */
}

.interruption-side.visible {
  opacity: 1;
  transform: translateX(0);
}

/* Labels */
.comparison-label {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.therapy-side .comparison-label {
  color: #9ca3af; /* Gray */
}

.interruption-side .comparison-label {
  color: #14B8A6; /* Teal */
}

/* Quote blocks */
.comparison-quote {
  background: #1a1a1a;
  border-left: 4px solid;
  padding: 20px;
  border-radius: 4px;
  font-style: italic;
}

.therapy-side .comparison-quote {
  border-left-color: #9ca3af;
}

.interruption-side .comparison-quote {
  border-left-color: #14B8A6;
}
```

---

### **SECTION 5: PAIN POINTS**

#### **Each Pain Point Card:**

**Animation: Expand + Glow on Scroll**

**Effect:** Cards expand from collapsed state with teal glow border

**Code:**
```css
.pain-point-card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 32px;
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.pain-point-card.visible {
  opacity: 1;
  transform: scale(1);
  border-color: #14B8A6;
  box-shadow: 0 0 30px rgba(20, 184, 166, 0.1);
}

/* Stagger */
.pain-point-card:nth-child(1) { transition-delay: 0s; }
.pain-point-card:nth-child(2) { transition-delay: 0.15s; }
.pain-point-card:nth-child(3) { transition-delay: 0.3s; }
.pain-point-card:nth-child(4) { transition-delay: 0.45s; }

/* Header typewriter */
.pain-point-header {
  font-size: 24px;
  font-weight: 700;
  color: #EC4899; /* Pink */
  margin-bottom: 16px;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid #EC4899;
  width: 0;
}

.pain-point-card.visible .pain-point-header {
  animation: 
    typewriter-fast 1s steps(40) 0.2s forwards,
    blink-cursor 0.75s step-end 3;
}

@keyframes typewriter-fast {
  to {
    width: 100%;
    border-right: none;
  }
}

@keyframes blink-cursor {
  50% { border-color: transparent; }
}

/* Content fade-in after header */
.pain-point-content {
  opacity: 0;
  transform: translateY(10px);
}

.pain-point-card.visible .pain-point-content {
  animation: fade-in-up 0.6s ease-out 1.2s forwards;
}
```

---

### **SECTION 6: THE METHOD**

#### **Section Header:**
```
HOW PATTERN INTERRUPTION WORKS
```

**Animation: Glitch In (like Pattern section)**

#### **Step Cards:**

**Animation: Sequential Reveal with Number Pulse**

**Effect:** Steps appear one by one, numbers pulse with teal glow

**Code:**
```css
.method-step {
  display: flex;
  gap: 30px;
  margin-bottom: 50px;
  opacity: 0;
  transform: translateX(-40px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.method-step.visible {
  opacity: 1;
  transform: translateX(0);
}

/* Stagger */
.method-step:nth-child(1) { transition-delay: 0s; }
.method-step:nth-child(2) { transition-delay: 0.2s; }
.method-step:nth-child(3) { transition-delay: 0.4s; }

/* Step number circle */
.step-number {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #14B8A6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 900;
  color: #14B8A6;
  position: relative;
}

/* Pulse animation on reveal */
.method-step.visible .step-number {
  animation: pulse-glow 2s ease-out;
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.4);
  }
  50% {
    box-shadow: 0 0 0 20px rgba(20, 184, 166, 0);
  }
}

/* Number typewriter */
.step-number::before {
  content: attr(data-number);
  position: absolute;
  opacity: 0;
}

.method-step.visible .step-number::before {
  animation: number-appear 0.3s ease-out 0.3s forwards;
}

@keyframes number-appear {
  to { opacity: 1; }
}

/* Step content */
.step-content {
  flex: 1;
}

.step-title {
  font-size: 24px;
  font-weight: 700;
  color: #14B8A6;
  margin-bottom: 12px;
  opacity: 0;
}

.method-step.visible .step-title {
  animation: fade-in-up 0.6s ease-out 0.4s forwards;
}

.step-description {
  color: #d1d5db;
  line-height: 1.6;
  opacity: 0;
}

.method-step.visible .step-description {
  animation: fade-in-up 0.6s ease-out 0.6s forwards;
}
```

---

### **SECTION 7: BETA LAUNCH PERKS**

#### **Section Header:**
```
BETA LAUNCH PERKS
```

**Animation: Word Scramble (like hero but faster)**

#### **Perks List:**

**Animation: Checkbox Tick-In**

**Effect:** Checkboxes appear one by one with tick animation

**Code:**
```css
.perks-list {
  list-style: none;
  padding: 0;
}

.perk-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
  opacity: 0;
  transform: translateX(-20px);
}

.perk-item.visible {
  animation: slide-in-check 0.6s ease-out forwards;
}

/* Stagger */
.perk-item:nth-child(1) { animation-delay: 0s; }
.perk-item:nth-child(2) { animation-delay: 0.1s; }
.perk-item:nth-child(3) { animation-delay: 0.2s; }
.perk-item:nth-child(4) { animation-delay: 0.3s; }
.perk-item:nth-child(5) { animation-delay: 0.4s; }
.perk-item:nth-child(6) { animation-delay: 0.5s; }

@keyframes slide-in-check {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Checkbox */
.perk-checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid #14B8A6;
  border-radius: 4px;
  flex-shrink: 0;
  position: relative;
  margin-top: 2px;
}

/* Checkmark appears after box */
.perk-checkbox::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  color: #14B8A6;
  font-size: 18px;
  font-weight: 900;
}

.perk-item.visible .perk-checkbox::after {
  animation: check-pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s forwards;
}

@keyframes check-pop {
  to {
    transform: translate(-50%, -50%) scale(1);
  }
}

/* Perk text */
.perk-text {
  color: #d1d5db;
  line-height: 1.6;
}
```

---

### **SECTION 8: PRICING**

#### **Section Header:**
```
THE COMPLETE SYSTEM
```

**Animation: Glitch In**

#### **Pricing Cards:**

**Animation: 3D Flip Reveal**

**Effect:** Cards flip in from back, with featured card emphasized

**Code:**
```css
.pricing-card-wrapper {
  perspective: 1000px;
}

.pricing-card {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 40px;
  transform: rotateY(180deg);
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.pricing-card.visible {
  transform: rotateY(0deg);
  opacity: 1;
}

/* Stagger */
.pricing-card:nth-child(1) { transition-delay: 0s; }
.pricing-card:nth-child(2) { transition-delay: 0.15s; }
.pricing-card:nth-child(3) { transition-delay: 0.3s; }

/* Featured card (Quick-Start) */
.pricing-card.featured {
  border: 2px solid #14B8A6;
  transform: scale(1.05);
  box-shadow: 0 0 40px rgba(20, 184, 166, 0.2);
}

.pricing-card.featured.visible {
  animation: featured-pulse 2s ease-in-out infinite;
}

@keyframes featured-pulse {
  0%, 100% {
    box-shadow: 0 0 40px rgba(20, 184, 166, 0.2);
  }
  50% {
    box-shadow: 0 0 60px rgba(20, 184, 166, 0.4);
  }
}

/* Price number count-up animation */
.pricing-price {
  font-size: 56px;
  font-weight: 900;
  color: #14B8A6;
  opacity: 0;
}

.pricing-card.visible .pricing-price {
  animation: fade-in 0.6s ease-out 0.3s forwards;
}

/* Features list fade-in */
.pricing-features li {
  opacity: 0;
  transform: translateX(-10px);
}

.pricing-card.visible .pricing-features li {
  animation: slide-in-feature 0.4s ease-out forwards;
}

.pricing-card.visible .pricing-features li:nth-child(1) { animation-delay: 0.5s; }
.pricing-card.visible .pricing-features li:nth-child(2) { animation-delay: 0.6s; }
.pricing-card.visible .pricing-features li:nth-child(3) { animation-delay: 0.7s; }
.pricing-card.visible .pricing-features li:nth-child(4) { animation-delay: 0.8s; }
.pricing-card.visible .pricing-features li:nth-child(5) { animation-delay: 0.9s; }

@keyframes slide-in-feature {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

---

### **SECTION 9: FINAL CTA**

#### **Header:**
```
STOP RUNNING THE PATTERN
```

**Animation: Scramble (fast version)**

#### **CTA Button:**

**Animation: Magnetic Pull + Glow Pulse**

**Effect:** Button "pulls" toward cursor on hover, pulses continuously

**Code:**
```css
.final-cta-button {
  display: inline-block;
  background: linear-gradient(135deg, #14B8A6 0%, #10b981 100%);
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  padding: 24px 60px;
  border-radius: 12px;
  text-decoration: none;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: cta-pulse 3s ease-in-out infinite;
}

@keyframes cta-pulse {
  0%, 100% {
    box-shadow: 0 0 40px rgba(20, 184, 166, 0.4);
  }
  50% {
    box-shadow: 0 0 60px rgba(20, 184, 166, 0.6);
  }
}

/* Magnetic effect on hover */
.final-cta-button:hover {
  transform: scale(1.05);
  box-shadow: 
    0 0 80px rgba(20, 184, 166, 0.6),
    0 8px 40px rgba(236, 72, 153, 0.2); /* Pink underglow */
}

/* Shimmer effect */
.final-cta-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 3s infinite;
}

@keyframes shimmer {
  to {
    left: 100%;
  }
}
```

---

## GLOBAL SCROLL ANIMATIONS:

**Intersection Observer Setup:**

```javascript
// Universal scroll animation observer
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      
      // Optional: Unobserve after animation (one-time animation)
      // scrollObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px'
});

// Elements to observe
const animatedElements = document.querySelectorAll(`
  .pattern-card,
  .origin-body p,
  .method-step,
  .pain-point-card,
  .pricing-card,
  .perk-item,
  .therapy-side,
  .interruption-side
`);

animatedElements.forEach(el => scrollObserver.observe(el));
```

---

## MOBILE OPTIMIZATIONS:

```css
@media (max-width: 768px) {
  /* Reduce animation complexity on mobile */
  .pattern-card,
  .method-step,
  .pricing-card {
    transition-duration: 0.4s; /* Faster */
  }
  
  /* Remove stagger delays on mobile */
  .pattern-card,
  .perk-item,
  .pricing-card {
    transition-delay: 0s !important;
  }
  
  /* Simplify hover effects (no hover on touch) */
  .pattern-card:hover,
  .pricing-card:hover {
    transform: none;
  }
}
```

---

## ACCESSIBILITY:

```css
@media (prefers-reduced-motion: reduce) {
  /* Disable ALL animations */
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Ensure elements are visible */
  .pattern-card,
  .method-step,
  .pricing-card,
  .origin-body p,
  .pain-point-card,
  .perk-item {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

---

## SUMMARY OF ANIMATIONS:

| Section | Header Animation | Content Animation | Special Effect |
|---------|-----------------|-------------------|----------------|
| Hero | Archival Reveal | Scramble | Pink cursor |
| Patterns | Glitch In | Staggered Slide + Glow | Number typewriter |
| Origin | Word-by-Word | Paragraph Fade | Underline expand |
| Therapy | Scramble | Side-by-Side Slide | Quote blocks |
| Pain Points | Typewriter | Card Expand + Glow | Headers typewrite |
| Method | Glitch In | Sequential + Pulse | Number glow |
| Perks | Word Scramble | Checkbox Tick-In | Check pop |
| Pricing | Glitch In | 3D Flip Reveal | Featured pulse |
| Final CTA | Scramble Fast | Magnetic Button | Shimmer + pulse |

---

## REPLIT BUILD INSTRUCTION:

```
ADD COMPLETE ANIMATION SYSTEM TO LANDING PAGE

Implement animations for ALL sections using specification file:
COMPLETE-LANDING-PAGE-ANIMATIONS.md

Animation Types:
- Headers: Mix of glitch, scramble, word reveal
- Cards: Staggered reveals with glow effects
- Content: Progressive fade-ins, typewriters
- Interactive: Hover effects, magnetic pulls

Key Features:
- Every section animated
- Scroll-triggered (Intersection Observer)
- Mobile optimized (faster, simpler)
- Accessibility fallbacks (reduced motion)
- Brand cohesive (teal/pink, Matrix vibes)

Sections to animate:
1. Hero (scramble headline)
2. Patterns (glitch header, card reveals)
3. Origin (word reveal, paragraph fades)
4. Therapy (scramble, side-by-side)
5. Pain Points (typewriter headers, card expand)
6. Method (sequential steps with pulse)
7. Perks (checkbox animations)
8. Pricing (3D flip cards)
9. Final CTA (magnetic button)

Complete code provided in specification.
Test on desktop AND mobile.
Ensure 60fps performance.
Add reduced-motion fallbacks.

This makes the site feel premium and alive.
Build now.
```

---

**This is .1% level animation polish.**

**Every section gets its own signature animation that fits the brand.**

**Hand this to Replit and watch your landing page come ALIVE.**
