# The Archivist Method™

## Overview

The Archivist Method™ is a dark-themed digital product sales funnel for psychology pattern recognition services. The application offers two products: a Pattern Recognition Session ($47) and a Complete Pattern Archive ($97). The site features a landing page with product offerings, a thank-you page for post-purchase upsells, and a member portal with video content, downloadable materials, and an AI chatbot interface ("The Archivist").

The application uses a full-stack TypeScript architecture with React on the frontend and Express on the backend, designed to run on Replit with integrated database and authentication capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool and development server

**Routing**: Wouter for client-side routing, providing a lightweight alternative to React Router

**UI Component Library**: Shadcn/ui components built on Radix UI primitives, providing accessible, customizable components following the "New York" style variant

**Styling System**: 
- Tailwind CSS for utility-first styling
- CSS variables for theming (dark mode by default)
- Custom design system with specific color palette: black background (#000000), off-white text (#FAFAFA), teal primary accent (#00FFC8), pink secondary accent (#FF0094)
- Component styling uses class-variance-authority for variant management

**State Management**: 
- TanStack Query (React Query) for server state management
- Local component state with React hooks
- No global state management library (Redux, Zustand, etc.)

**Key Pages**:
- Landing page (/) - Quiz-first design with 8 sections: Hero, Trust Builder, 7 Patterns, How It Works, Original Room, Pricing, Social Proof, Final CTA. All CTAs link to /quiz
- Quiz (/quiz) - 10-question Pattern Identification Quiz with multi-select scoring algorithm
- Quiz Results (/quiz/result/:pattern) - 7 pattern-specific result pages with email capture
- Quiz Fallback (/quiz/result/select) - Manual pattern selection for users with no clear result
- Thank you pages (/thank-you, /thank-you-quick-start, /thank-you-complete) - Post-purchase confirmation with upsells
- Member portal (/portal) - Tabbed interface with content, AI chat, and account sections

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript

**Server-Side Rendering**: Vite middleware in development for HMR and SSR capabilities

**API Design**: RESTful API structure with routes prefixed with `/api`

**Session Management**: Planned integration with express-session and session storage (connect-pg-simple for PostgreSQL-backed sessions)

**Build Process**: esbuild for server bundling with selective dependency bundling to optimize cold start times

**Middleware Stack**:
- JSON body parsing with raw body preservation for webhook verification
- URL-encoded body parsing
- Request logging with timestamp formatting
- Static file serving for production builds

### Data Storage

**Database**: PostgreSQL with Drizzle ORM for type-safe database operations

**Schema Design**: 
- Users table with UUID primary keys, username, and password fields
- Schema defined in shared directory for isomorphic access

**Database Client**: node-postgres (pg) connection pool

**Migrations**: Drizzle Kit for schema migrations with migrations stored in `/migrations` directory

**Storage Interface**: Abstracted storage layer with IStorage interface allowing for different implementations (currently has MemStorage for in-memory operations during development)

### Authentication & Authorization

**Authentication Strategy**: Designed for Replit Auth integration (implementation pending)

**Session Storage**: PostgreSQL-backed sessions using connect-pg-simple

**Password Handling**: Planned integration with password hashing libraries (bcrypt/argon2)

**Protected Routes**: Member portal requires authentication, with LoginPrompt component for unauthenticated users

### External Dependencies

**AI Integration**: Anthropic Claude API (@anthropic-ai/sdk) for the AI chatbot ("The Archivist") feature in the member portal

**Payment Processing**: Stripe integration planned for checkout flows (both initial purchases and upsells)

**Email Delivery**: Nodemailer dependency included for transactional emails (access credentials, purchase confirmations)

**Form Validation**: 
- Zod for runtime type validation and schema definition
- React Hook Form with @hookform/resolvers for form state management
- Drizzle-Zod for generating Zod schemas from database schemas

**Development Tools**:
- Replit-specific plugins for development experience (vite-plugin-runtime-error-modal, vite-plugin-cartographer, vite-plugin-dev-banner)
- TypeScript for type safety across the stack

**UI Dependencies**:
- Radix UI primitives for accessible component foundations
- Lucide React for iconography
- date-fns for date manipulation
- cmdk for command palette functionality
- vaul for drawer components
- embla-carousel-react for carousels
- react-day-picker for calendar components
- recharts for data visualization (if needed)

### Design System Implementation

**Theme**: Dark mode enforced throughout with brutalist minimalism aesthetic

**Typography**: System font stack (no external font loading for performance)

**Component Patterns**:
- Card-based layouts with consistent border radius and spacing
- High contrast color schemes for accessibility
- Smooth animations and transitions
- Mobile-first responsive design
- Consistent spacing using Tailwind's spacing scale (4, 8, 12, 16, 24)

**Path Aliases**: Configured for clean imports (@/ for client/src, @shared for shared code, @assets for static assets)