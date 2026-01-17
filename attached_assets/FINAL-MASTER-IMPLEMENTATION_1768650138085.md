# THE ARCHIVIST METHOD - FINAL MASTER IMPLEMENTATION
## Complete Landing Page - Ready to Build

---

## OVERVIEW

This is the complete, production-ready landing page specification.

**What's included:**
- Minimal, decluttered structure (7 sections, not 10+)
- Founding Member offer (beta tester strategy)
- Archival Reveal animation (brand-aligned motion)
- Complete copy (word-for-word)
- Design system (colors, fonts, spacing)
- Mobile optimization
- Accessibility (WCAG AA)
- Performance requirements

**Hand this to Replit. Build it exactly as specified.**

---

## STRATEGIC FOUNDATION

### **Traffic Sources (Universal Approach):**
- HeyGen shorts (warm, pattern-aware)
- Google search (cold, problem-searching)
- Social media ads (cold, curiosity)
- Reddit/forums (skeptical researchers)
- Word of mouth (recommendations)
- YouTube (educated, ready to buy)

### **User Journey:**
1. Land on page (from various sources)
2. See brand + hook (immediate context)
3. Recognize pattern in cards ("holy shit that's me")
4. Understand origin (The Original Room)
5. See method (how interruption works)
6. Founding member offer (beta tester value)
7. Take assessment (free, no email yet)

### **Conversion Goal:**
Get users to take the pattern assessment.

---

## PAGE STRUCTURE (7 Sections - Minimal)

1. **Hero** - Brand lockup + hook + CTA
2. **Pattern Cards** - Recognition engine (7 patterns)
3. **The Origin** - The Original Room (compressed to 3 paragraphs)
4. **The Method** - How interruption works (3 steps)
5. **Founding Member Offer** - Beta tester pitch (replaces pricing)
6. **Final CTA** - Simple, clear call to action
7. **Minimal Footer** - Essential links only

**Navigation:** Logo only (minimal header, no nav clutter)

---

## SECTION 1: HERO

### **Visual Layout:**
```
[Background: Dark library image, atmospheric, mysterious]
[Darkened overlay for text readability: rgba(10,10,10,0.7)]
[Centered content, max-width: 900px]

[Brand Lockup - Centered, Animated]
THE ARCHIVIST METHOD™
PATTERN ARCHAEOLOGY, NOT THERAPY

[Visual break: 40px]

[Headline - 40-48px, white, bold]
Stop Running the Same Destructive Patterns

[Subhead - 20px, light gray, 2 lines]
You watch yourself do it. You know it's happening. 
You do it anyway.

[CTA Button - Large, teal, prominent]
Take the Pattern Assessment →

[Trust indicators below - 14px, gray]
Free • 2 Minutes • Instant Results
```

### **Animation Specs (CRITICAL - ARCHIVAL REVEAL):**

**The Brand Lockup Animation:**

This is the signature animation. It mimics pulling a document from an archive sleeve—deliberate, premium, gothic.

```css
/* Parent Container */
.brand-lockup {
  overflow: hidden;
  position: relative;
  height: 120px;
  text-align: center;
  margin-bottom: 40px;
}

/* Title Animation */
.brand-title {
  font-family: 'Bebas Neue', 'Oswald', sans-serif;
  font-size: 64px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #ffffff;
  margin: 0;
  line-height: 1.1;
  
  /* Start state: Hidden below */
  transform: translateY(100%);
  opacity: 0;
  
  /* Animation: Slide up reveal */
  animation: archival-reveal 1.2s cubic-bezier(0.77, 0, 0.175, 1) 0.3s forwards;
}

/* Tagline Animation */
.brand-tagline {
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #ffffff;
  margin: 8px 0 0 0;
  
  /* Start state: Hidden */
  opacity: 0;
  
  /* Animation: Fade in after title */
  animation: fade-in 0.8s ease-out 1.0s forwards;
}

/* Pink accent on "NOT" */
.brand-tagline .not {
  color: #EC4899;
}

/* Keyframes */
@keyframes archival-reveal {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Accessibility: Reduced motion fallback */
@media (prefers-reduced-motion: reduce) {
  .brand-title,
  .brand-tagline {
    animation: none;
    transform: none;
    opacity: 1;
  }
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .brand-lockup {
    height: 100px;
  }
  
  .brand-title {
    font-size: 40px;
  }
  
  .brand-tagline {
    font-size: 16px;
  }
}
```

**Animation Timeline:**
- 0.0s: Page loads, space visible but empty
- 0.3s: Title starts sliding up from below
- 1.5s: Title fully revealed
- 1.0s: Tagline starts fading in
- 1.8s: Both fully visible, animation complete

**Psychology:** Mimics uncovering archival documents. Deliberate, premium, brand-aligned.

### **Font Loading:**

```html
<!-- Google Fonts - Preload for performance -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

### **Complete Hero Section Copy:**

```
THE ARCHIVIST METHOD™
PATTERN ARCHAEOLOGY, NOT THERAPY
          ↑ "NOT" in pink (#EC4899) only

Stop Running the Same Destructive Patterns

You watch yourself do it. You know it's happening. 
You do it anyway.

[Take the Pattern Assessment →]

Free • 2 Minutes • Instant Results
```

### **Design Specs:**

```css
.hero-section {
  background: url('library-background.jpg') center/cover;
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 20px 80px;
}

.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(10,10,10,0.7) 0%,
    rgba(10,10,10,0.85) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  text-align: center;
}

.hero-headline {
  font-size: 48px;
  font-weight: 700;
  color: #ffffff;
  margin: 40px 0 24px;
  line-height: 1.2;
}

.hero-subhead {
  font-size: 20px;
  font-weight: 400;
  color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 40px;
}

.cta-primary {
  display: inline-block;
  background: #14B8A6;
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  padding: 18px 40px;
  border-radius: 8px;
  text-decoration: none;
  box-shadow: 0 0 20px rgba(20, 184, 166, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 0 30px rgba(20, 184, 166, 0.4),
    0 4px 40px rgba(236, 72, 153, 0.15);
}

.trust-indicators {
  margin-top: 16px;
  font-size: 14px;
  color: #9ca3af;
}

/* Mobile */
@media (max-width: 768px) {
  .hero-section {
    min-height: 90vh;
    padding: 100px 20px 60px;
  }
  
  .hero-headline {
    font-size: 36px;
  }
  
  .hero-subhead {
    font-size: 18px;
  }
  
  .cta-primary {
    width: 90%;
    max-width: 400px;
  }
}
```

---

## SECTION 2: THE 7 PATTERNS (Recognition Engine)

### **Strategic Purpose:**
This is THE highest-converting element. Pattern recognition creates "holy shit that's me" moment.

### **Layout:**

```
[Background: Pure black #000000]
[Padding: 120px top/bottom]
[Max-width: 1400px centered]

[Section Headline - 48px, white, bold, centered]
THE 7 DESTRUCTIVE PATTERNS

[Subhead - 20px, gray, centered]
One (or more) of these is running your life:

[7 Pattern Cards in 2-column grid]

[Below cards - centered]
Which one made your stomach drop?

[CTA]
Find Your Pattern - Take Assessment →
```

### **Pattern Card Design:**

```css
.pattern-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  margin: 60px 0;
}

.pattern-card {
  background: #1a1a1a;
  border: 1px solid #333333;
  padding: 32px;
  border-radius: 8px;
  
  /* Scroll animation - Start state */
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

/* Visible state - triggered by Intersection Observer */
.pattern-card.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Stagger animation delay */
.pattern-card:nth-child(1) { transition-delay: 0s; }
.pattern-card:nth-child(2) { transition-delay: 0.1s; }
.pattern-card:nth-child(3) { transition-delay: 0.2s; }
.pattern-card:nth-child(4) { transition-delay: 0.3s; }
.pattern-card:nth-child(5) { transition-delay: 0.4s; }
.pattern-card:nth-child(6) { transition-delay: 0.5s; }
.pattern-card:nth-child(7) { transition-delay: 0.6s; }

/* Hover state */
.pattern-card:hover {
  transform: translateY(-4px);
  box-shadow: 
    0 8px 30px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(20, 184, 166, 0.1);
  transition: all 0.3s ease;
}

.pattern-number {
  color: #14B8A6;
  font-size: 28px;
  font-weight: 700;
  display: inline;
}

.pattern-name {
  color: #ffffff;
  font-size: 20px;
  font-weight: 700;
  display: inline;
  margin-left: 8px;
}

.pattern-description {
  color: #d1d5db;
  font-size: 16px;
  line-height: 1.6;
  margin-top: 12px;
}

/* Mobile */
@media (max-width: 768px) {
  .pattern-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .pattern-card {
    padding: 24px;
  }
}
```

### **Complete Pattern Card Copy (Use Exact Text):**

**1. DISAPPEARING**
You ghost when relationships get close. Three months in, they say "I love you"—your chest gets tight. Every time.

**2. APOLOGY LOOP**
You apologize for existing. "Sorry to bother you." "Sorry, quick question." Twenty times a day for things that need no apology.

**3. TESTING**
You push people away to see if they'll stay. They pass the test? You create a bigger one. You don't trust "I'm not leaving" until you've tested it 47 ways.

**4. ATTRACTION TO HARM**
Safe people feel boring. Chaos feels like chemistry. Red flags don't register as warnings—they register as attraction. Harm feels like home.

**5. COMPLIMENT DEFLECTION**
You can't accept praise. Someone says "great work"—you deflect, minimize, redirect. Visibility makes you squirm. Recognition makes you want to disappear.

**6. DRAINING BOND**
You can't leave. Toxic job, harmful relationship, depleting friendship. You know you should go. Everyone tells you to leave. You stay.

**7. SUCCESS SABOTAGE**
You destroy things right before they succeed. Three weeks from launch, you quit. One week from promotion, you blow it up. Sustained success triggers panic—so you destroy it first.

### **JavaScript for Scroll Animation:**

```javascript
// Intersection Observer for scroll animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all pattern cards
document.querySelectorAll('.pattern-card').forEach(card => {
  observer.observe(card);
});

// Observe section headlines
document.querySelectorAll('.section-headline').forEach(headline => {
  observer.observe(headline);
});
```

---

## SECTION 3: THE ORIGIN (The Original Room)

### **Strategic Purpose:**
Explain "why do I do this?" - Reframe from shame to mechanism.

### **Layout:**

```
[Background: #0d0d0d - slightly lighter for visual break]
[Padding: 100px top/bottom]
[Max-width: 900px centered]

[Section Headline - 42px, white, bold]
THESE AREN'T PERSONALITY TRAITS.
THEY'RE SURVIVAL CODE.

[Body text - 3 paragraphs, 18px, light gray]

[CTA]
Learn Your Pattern - Take Assessment →
```

### **Complete Copy:**

```
THESE AREN'T PERSONALITY TRAITS. THEY'RE SURVIVAL CODE.

The patterns installed in what we call The Original Room.

Your childhood. The environment that shaped your nervous system 
before you had language to process what was happening.

In The Original Room, you learned equations:

  Closeness = Danger
  Your Needs = Burden to Others
  Love = Pain + Chaos
  Success = Threat Incoming

Those equations are still running. Not because you're broken. 
Because your nervous system is doing exactly what it was trained 
to do 20 years ago.

Right now, your patterns run in a 3-7 second window:

Trigger → Body Sensation → Thought → Behavior

You don't catch the pattern until after it's already executed.

Pattern archaeology teaches you to recognize the pattern BEFORE 
it runs. In that 3-7 second window. In that recognition, you 
create a gap. In that gap, you can interrupt the code.

[Learn Your Pattern - Take Assessment →]
```

### **Design Specs:**

```css
.origin-section {
  background: #0d0d0d;
  padding: 100px 20px;
}

.origin-content {
  max-width: 900px;
  margin: 0 auto;
}

.origin-headline {
  font-size: 42px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 40px;
  line-height: 1.3;
  
  /* Scroll animation */
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.8s ease-out, transform 0.8s ease-out;
}

.origin-headline.visible {
  opacity: 1;
  transform: translateY(0);
}

.origin-body {
  font-size: 18px;
  color: #d1d5db;
  line-height: 1.8;
  margin-bottom: 20px;
}

.origin-equations {
  font-size: 20px;
  color: #14B8A6;
  line-height: 1.8;
  margin: 30px 0;
  padding-left: 20px;
}

.origin-window {
  font-size: 20px;
  color: #14B8A6;
  text-align: center;
  margin: 30px 0;
  font-weight: 600;
}

/* Mobile */
@media (max-width: 768px) {
  .origin-section {
    padding: 80px 20px;
  }
  
  .origin-headline {
    font-size: 32px;
  }
  
  .origin-body {
    font-size: 16px;
  }
}
```

---

## SECTION 4: THE METHOD (How It Works)

### **Strategic Purpose:**
Show concrete process. Demystify. Set expectations.

### **Layout:**

```
[Background: #000000]
[Padding: 100px top/bottom]
[Max-width: 1000px centered]

[Section Headline - 42px, white, bold]
HOW PATTERN INTERRUPTION WORKS

[3 Steps - Vertical layout with visual circles]

[Closing text]

[CTA]
Start Your Free Protocol →
```

### **Complete Copy:**

```
HOW PATTERN INTERRUPTION WORKS

STEP 1: IDENTIFY YOUR PATTERN
Take the 2-minute assessment. Get your pattern analysis and the 
specific equation running your life.

STEP 2: LEARN YOUR BODY SIGNATURE
Your body signals the pattern 3-7 seconds before it runs. That 
chest tightness. That sudden urge to flee. That crushing guilt. 
Learn to recognize your warning.

STEP 3: INTERRUPT & TRACK
When you feel your body signature, speak your circuit break 
statement. Out loud or internal. Track attempts. Refine approach. 
You get better every time.

The 7-day protocol gives you proof of concept. One successful 
interrupt = the method works for you. Then decide.

[Start Your Free Protocol →]
```

### **Design Specs:**

```css
.method-section {
  background: #000000;
  padding: 100px 20px;
}

.method-content {
  max-width: 1000px;
  margin: 0 auto;
}

.method-steps {
  margin: 60px 0;
}

.method-step {
  display: flex;
  gap: 30px;
  margin-bottom: 50px;
  align-items: flex-start;
}

.step-number {
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #14B8A6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: #14B8A6;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 24px;
  font-weight: 700;
  color: #14B8A6;
  margin-bottom: 8px;
}

.step-description {
  font-size: 18px;
  color: #d1d5db;
  line-height: 1.6;
}

.method-closing {
  font-size: 18px;
  color: #d1d5db;
  text-align: center;
  margin: 40px 0;
  line-height: 1.8;
}

/* Mobile */
@media (max-width: 768px) {
  .method-step {
    flex-direction: column;
    gap: 16px;
  }
  
  .step-number {
    width: 50px;
    height: 50px;
    font-size: 24px;
  }
  
  .step-title {
    font-size: 20px;
  }
  
  .step-description {
    font-size: 16px;
  }
}
```

---

## SECTION 5: FOUNDING MEMBER OFFER (Replaces Pricing)

### **Strategic Purpose:**
- Turn lack of testimonials into opportunity
- Get usage data, testimonials, insights
- Create urgency (ends Feb 28, 2026)
- Position users as collaborators, not customers
- Massive value exchange ($244 free for feedback)

### **Layout:**

```
[Background: #0d0d0d with subtle teal glow]
[Padding: 120px top/bottom]
[Max-width: 1100px centered]

[Section Headline - 48px, white, bold]
YOU'RE NOT EARLY. YOU'RE FIRST.

[Body copy - detailed value proposition]

[Benefits section - bulleted list]

[What we're asking - clear expectations]

[Urgency elements - deadline, limited spots]

[CTA]
Become a Founding Member - Free →
```

### **Complete Copy (Use Exact Text):**

```
YOU'RE NOT EARLY. YOU'RE FIRST.

The Archivist Method launched January 2026. This is the beta.

We need pattern interruption data from real attempts. Real results. 
Real failures. You test the method—we give you lifetime access to 
everything we build.

FOUNDING MEMBER BENEFITS:

• Free 7-Day Crash Course (immediate access)
• Free Quick-Start System when you complete crash course ($47 value)
• Free Complete Archive when it releases ($197 value)
• Your feedback shapes how we build this
• Lifetime access to all future updates
• First-mover status - you were here before anyone

Total value: $244 - Yours free.

WHAT WE'RE ASKING:

• Take the 7-day crash course
• Track your interrupt attempts (system does this automatically)
• Share what worked, what didn't (2-minute survey after)
• Optional: Write 2 sentences about your experience

That's it. No gimmicks. No obligations.

This ends February 28, 2026. After that, everyone pays.

Right now? You're not a customer. You're a founding member. 
A collaborator. Someone who was here first.

[Become a Founding Member - Free →]

Limited to first 500 members
```

### **Design Specs:**

```css
.founding-section {
  background: #0d0d0d;
  padding: 120px 20px;
  position: relative;
}

/* Subtle teal glow effect - barely visible */
.founding-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(20, 184, 166, 0.03) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.founding-content {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.founding-headline {
  font-size: 48px;
  font-weight: 700;
  color: #ffffff;
  text-align: center;
  margin-bottom: 30px;
}

.founding-intro {
  font-size: 20px;
  color: #d1d5db;
  text-align: center;
  line-height: 1.8;
  margin-bottom: 60px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.founding-benefits,
.founding-asking {
  background: #1a1a1a;
  border: 1px solid #333333;
  border-radius: 12px;
  padding: 40px;
  margin-bottom: 30px;
}

.founding-section-title {
  font-size: 24px;
  font-weight: 700;
  color: #14B8A6;
  margin-bottom: 20px;
}

.founding-list {
  list-style: none;
  padding: 0;
}

.founding-list li {
  font-size: 18px;
  color: #d1d5db;
  line-height: 1.8;
  margin-bottom: 12px;
  padding-left: 30px;
  position: relative;
}

.founding-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #14B8A6;
  font-size: 24px;
  font-weight: 700;
}

.founding-value {
  font-size: 20px;
  color: #ffffff;
  font-weight: 600;
  margin-top: 20px;
}

.founding-closing {
  font-size: 20px;
  color: #d1d5db;
  text-align: center;
  line-height: 1.8;
  margin: 40px 0;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.founding-deadline {
  font-size: 18px;
  color: #EC4899;
  text-align: center;
  font-weight: 600;
  margin: 20px 0;
}

.founding-limit {
  font-size: 14px;
  color: #9ca3af;
  text-align: center;
  margin-top: 16px;
}

/* Mobile */
@media (max-width: 768px) {
  .founding-section {
    padding: 80px 20px;
  }
  
  .founding-headline {
    font-size: 36px;
  }
  
  .founding-benefits,
  .founding-asking {
    padding: 24px;
  }
}
```

---

## SECTION 6: FINAL CTA

### **Layout:**

```
[Background: #000000]
[Padding: 80px top/bottom]
[Centered]

[Headline - 42px, white, bold]
STOP RUNNING THE PATTERN

[3 lines - 20px, gray]

[Large CTA button]

[Trust indicators]
```

### **Complete Copy:**

```
STOP RUNNING THE PATTERN

Take the 2-minute assessment.
Get your 7-day protocol.
Start breaking the cycle today.

[Take the Pattern Assessment →]

Free • Private • No Email Required • Instant Results
```

### **Design Specs:**

```css
.final-cta-section {
  background: #000000;
  padding: 80px 20px;
  text-align: center;
}

.final-cta-headline {
  font-size: 42px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 30px;
}

.final-cta-lines {
  font-size: 20px;
  color: #d1d5db;
  line-height: 1.8;
  margin-bottom: 40px;
}

.final-cta-button {
  display: inline-block;
  background: #14B8A6;
  color: #ffffff;
  font-size: 20px;
  font-weight: 600;
  padding: 20px 50px;
  border-radius: 8px;
  text-decoration: none;
  box-shadow: 0 0 30px rgba(20, 184, 166, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.final-cta-button:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 0 40px rgba(20, 184, 166, 0.5),
    0 6px 50px rgba(236, 72, 153, 0.2);
}

/* Mobile */
@media (max-width: 768px) {
  .final-cta-headline {
    font-size: 32px;
  }
  
  .final-cta-lines {
    font-size: 18px;
  }
  
  .final-cta-button {
    width: 90%;
    max-width: 400px;
    padding: 18px 40px;
  }
}
```

---

## SECTION 7: MINIMAL FOOTER

### **Layout:**

```
[Background: #000000]
[Padding: 60px]
[Centered, simple]

[Brand lockup - centered]
THE ARCHIVIST METHOD™
PATTERN ARCHAEOLOGY, NOT THERAPY

[Links - single line]
Method • Contact • Portal Login • Terms • Privacy

[Copyright]
© 2026 The Archivist Method
```

### **Design Specs:**

```css
.footer {
  background: #000000;
  padding: 60px 20px;
  text-align: center;
  border-top: 1px solid #1a1a1a;
}

.footer-brand {
  margin-bottom: 30px;
}

.footer-title {
  font-family: 'Bebas Neue', 'Oswald', sans-serif;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #ffffff;
  margin: 0;
}

.footer-tagline {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 8px 0 0 0;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.footer-link {
  color: #9ca3af;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: #EC4899;
}

.footer-copyright {
  font-size: 14px;
  color: #6b7280;
}

/* Mobile */
@media (max-width: 768px) {
  .footer-links {
    flex-direction: column;
    gap: 12px;
  }
}
```

---

## HEADER/NAVIGATION (Minimal)

### **Layout:**

```
[Left side]
[Small logo] THE ARCHIVIST METHOD™

[Right side]
[Portal Login] - small, subtle button
```

### **Design Specs:**

```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(10, 10, 10, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.header-logo-image {
  width: 40px;
  height: 40px;
}

.header-title {
  font-family: 'Bebas Neue', 'Oswald', sans-serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #ffffff;
  text-transform: uppercase;
}

.header-portal-login {
  color: #14B8A6;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border: 1px solid #14B8A6;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.header-portal-login:hover {
  background: #14B8A6;
  color: #ffffff;
}

/* Mobile */
@media (max-width: 768px) {
  .header {
    padding: 16px 20px;
  }
  
  .header-title {
    font-size: 16px;
  }
  
  .header-logo-image {
    width: 32px;
    height: 32px;
  }
}
```

---

## COMPLETE DESIGN SYSTEM

### **Color Palette:**

```css
/* Backgrounds */
--black-pure: #000000;
--black-soft: #0d0d0d;
--dark-card: #1a1a1a;
--dark-border: #333333;

/* Text */
--white: #ffffff;
--gray-light: #e5e5e5;
--gray-medium: #d1d5db;
--gray-dark: #9ca3af;
--gray-darker: #6b7280;

/* Brand */
--teal: #14B8A6;
--pink: #EC4899;

/* Usage */
Primary CTA: var(--teal) background
Secondary CTA: var(--teal) border
Hover accent: var(--pink) subtle glow
Brand accent: var(--pink) on "NOT" only
```

### **Typography System:**

```css
/* Font Families */
--font-display: 'Bebas Neue', 'Oswald', sans-serif;
--font-body: 'Inter', sans-serif;

/* Desktop Sizes */
--text-hero: 64px;
--text-h1: 48px;
--text-h2: 42px;
--text-h3: 28px;
--text-large: 24px;
--text-body: 18px;
--text-small: 14px;

/* Mobile Sizes */
--text-hero-mobile: 40px;
--text-h1-mobile: 36px;
--text-h2-mobile: 32px;
--text-h3-mobile: 24px;
--text-body-mobile: 16px;

/* Weights */
--weight-bold: 700;
--weight-semibold: 600;
--weight-regular: 400;

/* Line Heights */
--lh-tight: 1.2;
--lh-normal: 1.4;
--lh-relaxed: 1.6;
--lh-loose: 1.8;
```

### **Spacing System:**

```css
/* Section Padding */
--space-section-lg: 120px;
--space-section-md: 100px;
--space-section-sm: 80px;

/* Element Spacing */
--space-xl: 60px;
--space-lg: 40px;
--space-md: 32px;
--space-sm: 24px;
--space-xs: 16px;
--space-xxs: 8px;

/* Content Width */
--width-xl: 1400px;
--width-lg: 1100px;
--width-md: 900px;
--width-sm: 800px;
```

---

## PERFORMANCE REQUIREMENTS

### **Critical Path:**
1. HTML loads first
2. Critical CSS (above-fold) inline
3. Fonts preload
4. Hero background image priority load
5. Below-fold lazy loads
6. JavaScript deferred

### **Image Optimization:**

```
Hero background:
- Format: WebP with JPG fallback
- Size: 1920x1080
- Compressed: <200KB
- Preload: Yes (fetchpriority="high")

Other images:
- Format: WebP
- Lazy load: Yes (loading="lazy")
```

### **Font Loading:**

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

### **Animation Performance:**

```css
/* Only animate transform and opacity (GPU-accelerated) */
.animate-element {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force GPU */
}

/* Remove will-change after animation completes */
.animate-element.animation-done {
  will-change: auto;
}
```

### **Performance Targets:**
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Cumulative Layout Shift: <0.1
- Time to Interactive: <3.5s
- 60fps animations on mobile

---

## ACCESSIBILITY (WCAG AA)

### **Color Contrast (All Pass):**
- White (#ffffff) on Black (#000000): 21:1 ✓
- Light Gray (#d1d5db) on Black: 12:1 ✓
- Teal (#14B8A6) on Black: 7:1 ✓
- Pink (#EC4899) on Black: 5.5:1 ✓

### **Keyboard Navigation:**

```html
<!-- Skip to main content -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- Logical tab order -->
<main id="main-content">
  <!-- Content -->
</main>

<!-- Focus indicators -->
<style>
  *:focus-visible {
    outline: 2px solid #14B8A6;
    outline-offset: 2px;
  }
</style>
```

### **Screen Reader Support:**

```html
<!-- Semantic HTML -->
<header role="banner">
<main role="main">
<section aria-label="Pattern Cards">
<footer role="contentinfo">

<!-- Alt text -->
<img src="logo.svg" alt="The Archivist Method">

<!-- ARIA labels -->
<button aria-label="Take pattern assessment">
<nav aria-label="Main navigation">
```

### **Reduced Motion:**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## MOBILE OPTIMIZATION

### **Breakpoints:**

```css
/* Mobile */
@media (max-width: 768px) {
  /* Single column layouts */
  /* Reduce font sizes by 15-20% */
  /* Full-width CTAs */
  /* Hamburger menu if needed */
}

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) {
  /* 2-column grids reduce to 1 column for some */
  /* Slight font size reduction */
}

/* Desktop */
@media (min-width: 1025px) {
  /* Full desktop experience */
}
```

### **Mobile-Specific:**
- Touch targets minimum 44x44px
- Buttons full-width (90% max-width)
- Pattern cards stack vertically
- Generous padding for thumbs
- No hover-dependent functionality

---

## QUALITY CHECKLIST

### **Before Launch:**
- [ ] All animations work (Archival Reveal on brand lockup)
- [ ] Pattern cards scroll-animate with stagger
- [ ] All CTAs link to correct destination (/assessment or /quiz)
- [ ] Founding Member section displays correctly
- [ ] Mobile experience is perfect (test on actual device)
- [ ] Fonts load properly (Bebas Neue + Inter)
- [ ] Pink appears ONLY on "NOT" and CTA hover
- [ ] No console errors
- [ ] Page loads under 3 seconds
- [ ] Accessibility passes (keyboard nav, screen reader, contrast)
- [ ] All copy matches exactly as specified
- [ ] Footer links work
- [ ] Portal login works for existing users

---

## FINAL BUILD INSTRUCTIONS

### **Implementation Order:**

**Phase 1: Structure + Hero (2-3 hours)**
1. HTML structure (7 sections)
2. Hero section with Archival Reveal animation
3. Font loading (Bebas Neue + Inter)
4. Basic styling
5. Mobile responsive

**Phase 2: Content Sections (3-4 hours)**
6. Pattern cards with scroll animation
7. Origin section
8. Method section  
9. Founding Member section
10. Final CTA
11. Minimal footer

**Phase 3: Polish + Testing (2-3 hours)**
12. Hover states on all buttons
13. Scroll animations refined
14. Mobile optimization complete
15. Accessibility audit
16. Performance testing
17. Cross-browser testing

### **Success Criteria:**
✓ Archival Reveal animation works perfectly  
✓ Pattern cards create "holy shit" recognition  
✓ Founding Member offer is clear and compelling  
✓ Page feels minimal, not cluttered  
✓ Brand lockup is prominent (Bebas Neue + Inter)  
✓ Pink used strategically (NOT + hover only)  
✓ Mobile experience is flawless  
✓ Loads fast (<3s)  
✓ All copy matches specification  

---

## HAND THIS TO REPLIT

```
BUILD THIS EXACT LANDING PAGE

Use all specifications provided:
- Minimal 7-section structure
- Archival Reveal animation on brand lockup (CRITICAL)
- Pattern cards with scroll-in stagger animation
- Founding Member section (replaces pricing)
- Bebas Neue + Inter fonts
- Pink ONLY on "NOT" and subtle CTA hover
- Mobile-optimized
- Accessibility compliant
- Performance optimized

Follow every spec exactly.
Use provided copy word-for-word.
Implement animations as specified.

This is the final, production-ready version.
Build it.
```

---

**This is complete. Everything you need is here.**

Hand it to Replit. Build it. Ship it.

You're done planning. Now execute.

Let's fucking go.
