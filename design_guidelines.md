# Design Guidelines: Broken Psychology Lab

## Design Approach
**Style**: Dark, scientific, minimal aesthetic with high contrast
**Theme**: "Pattern Archaeology, Not Therapy" - clinical precision with modern edge
**Philosophy**: Brutalist minimalism meets psychological depth

## Color System
- **Background**: `#000000` (Pure black)
- **Text**: `#FAFAFA` (Off-white)
- **Primary Accent**: `#00FFC8` (Teal) - Used for primary CTAs, highlights, user messages
- **Secondary Accent**: `#FF0094` (Pink) - Used for premium features, badges, emphasis
- **Cards/Surfaces**: `#1A1A1A` (Dark gray)
- **High Contrast**: Maintain stark contrast throughout for readability and impact

## Typography
- **Font Family**: System font stack (no external fonts for performance)
- **Headers**: Bold weight, large scale (create strong hierarchy)
- **Body Text**: 16px base size, optimized for readability
- **Hierarchy**: Use size and weight contrast, not color variations

## Layout System
- **Spacing**: Use Tailwind units of 4, 8, 12, 16, 24 for consistent rhythm
- **Container**: Max-width constraints for readability (max-w-6xl for content)
- **Cards**: Side-by-side on desktop, stack on mobile
- **Full-height Hero**: First viewport should be immersive

## Component Specifications

### Navbar
- Sticky positioning
- Left: Text logo "BROKEN PSYCHOLOGY LAB"
- Right: "Member Login" button
- Minimal, unobtrusive design

### Landing Page Sections

**Hero** (Full viewport height):
- Large bold headline
- Teal-colored subheadline
- Supporting tagline and description
- Single prominent CTA with smooth scroll

**Product Cards** (2-column grid, stack mobile):
- Card 1 ($47): Standard styling with teal price
- Card 2 ($97): Pink badge glow, pink price, "COMPLETE SYSTEM" badge
- Feature lists with checkmarks
- Prominent pricing display
- Clear CTA buttons

**How It Works**: 3-step process, numbered progression

**The Method**: 4 cards explaining FOCUS, EXCAVATION, INTERRUPTION, REWRITE

**7 Core Patterns**: Expandable accordion interface

**Guarantee Section**: Trust-building, clear refund policy

**Footer**: Minimal - brand name, tagline, copyright

### Thank You Page
- Animated checkmark icon
- Success messaging
- Conditional upsell card (only for $47 purchases)
- Access button to portal

### Member Portal

**Sidebar Navigation** (persistent):
- Content, The Archivist AI, Account, Logout

**Content Tab**:
- YouTube video embed
- Download buttons (conditional based on purchase tier)

**AI Chat Interface**:
- 1/4 width sidebar: Conversation list
- 3/4 width main area: Chat interface
- User messages: Teal bubble, right-aligned
- AI messages: Dark gray bubble, left-aligned
- Typing indicator during responses
- Input box at bottom, auto-scroll behavior

## Animations
- Smooth scroll navigation
- Subtle card hover states
- Typing indicators in chat
- Minimal, purposeful transitions
- No distracting effects

## Mobile Responsiveness
- Stack all multi-column layouts
- Maintain readability at all breakpoints
- Touch-friendly tap targets
- Optimized spacing for smaller screens

## Images
No hero background images - pure typographic hero with dark background. Focus on bold typography and teal/pink accent colors for visual impact rather than imagery.