# IXC Finance - Onboarding Application

A modern authentication and onboarding experience for IncoXchange finance platform. Built with Next.js, React, TypeScript, Tailwind CSS, and Material UI.

## Tech Stack

- **Next.js 16.0.2** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **Material UI** - React component library (@mui/material)
- **Emotion** - CSS-in-JS styling (@emotion/react, @emotion/styled)
- **Material UI Icons** - Icon library
- **Mona Sans** - Custom typography (@fontsource/mona-sans)
- **ESLint** - Code linting

## Project Structure

```
ixc-onboading/
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # Root layout with theme provider
│   │   ├── page.tsx                 # Home page (redirects to /signup)
│   │   ├── signup/                  # Sign up flow
│   │   │   ├── page.tsx            # Sign up form with magic link
│   │   │   └── verify/
│   │   │       └── page.tsx        # Email verification screen
│   │   ├── signin/                  # Sign in flow
│   │   │   └── page.tsx            # Sign in form with magic link
│   │   ├── onboarding/              # Multi-step onboarding
│   │   │   └── page.tsx            # Onboarding orchestrator
│   │   ├── dashboard/               # Dashboard (placeholder)
│   │   │   └── page.tsx            # Main dashboard
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── ThemeProvider.tsx        # Material UI theme configuration
│   │   └── onboarding/              # Onboarding step components
│   │       ├── OnboardingLayout.tsx # Layout with sidebar stepper
│   │       ├── WelcomeStep.tsx      # Step 1: Welcome
│   │       ├── BusinessProfileStep.tsx # Step 2: Business info
│   │       ├── CustomersStep.tsx    # Step 3: Add customers
│   │       ├── BankConnectStep.tsx  # Step 4: Bank connection
│   │       ├── InvoicesStep.tsx     # Step 5: Upload invoices
│   │       ├── ReviewStep.tsx       # Step 6: Review all data
│   │       └── FactoringAgreementStep.tsx # Step 7: Sign agreement
│   └── lib/
│       └── emotion-cache.ts         # Emotion cache for SSR
├── public/                          # Static assets
│   ├── incoxchange-logomark.svg     # Brand logo
│   ├── banks/                       # Bank logos
│   │   ├── plaid.svg
│   │   ├── chase.svg
│   │   ├── wells-fargo.svg
│   │   └── bank-of-america.svg
│   └── images/                      # Background images
│       ├── bg-female-phone.png
│       └── female-fruits.jpg
├── package.json                     # Dependencies
└── tsconfig.json                    # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Design System

### Color Palette

**Primary - Azure Radiance:**
- 50: `#eff6ff`
- 100: `#daeaff`
- 200: `#bedcff`
- 300: `#91c6ff`
- 400: `#5da7fd`
- 500: `#2c7cf9`
- 600: `#2164ef` (main)
- 700: `#1a4edb`
- 800: `#1b41b2`
- 900: `#1c3a8c`

**Gray Scale:**
- 50: `#FAFAFA`
- 100: `#F5F5F5`
- 200: `#E9EAEB`
- 300: `#D5D7DA`
- 400: `#A4A7AE`
- 500: `#717680`
- 600: `#535862`
- 700: `#414651`
- 800: `#252B37`
- 900: `#181D27`

### Typography

**Font Family:** Mona Sans

**Type Scale:**
- Display 2xl: 72px (h1)
- Display xl: 60px (h2)
- Display lg: 48px (h3)
- Display md: 36px (h4)
- Display sm: 30px (h5) - Used for main headings
- Display xs: 24px (h6)
- Text lg: 18px (subtitle1)
- Text md: 16px (body1)
- Text sm: 14px (body2)
- Text xs: 12px (caption)

**Font Weights:**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Application Flow

### Authentication

1. **Sign Up** (`/signup`)
   - User enters email
   - Sends magic link
   - Redirects to verification screen

2. **Email Verification** (`/signup/verify`)
   - Shows countdown timer (15 minutes)
   - Resend link functionality
   - Demo: "Skip to Onboarding" button

3. **Sign In** (`/signin`)
   - Same magic link flow for existing users

### Onboarding Flow

**7-Step Process:**

1. **Welcome** - Introduction screen
2. **Business Profile** - Company details with validation
3. **Customers** - Add customers via dialog (multi-add supported)
4. **Bank Connect** - Connect via Plaid/bank or manually
5. **Invoices** - Upload invoices with drag & drop + scanning simulation
6. **Review** - Review all data with edit functionality
7. **Factoring Agreement** - E-signature and completion

### State Management

**Centralized State:** All onboarding data is managed in `src/app/onboarding/page.tsx`

```typescript
interface OnboardingData {
  businessProfile: { ... };
  customers: [...];
  bankConnection: { ... };
  invoices: [...];
}
```

**Features:**
- Data persists across steps
- Pre-filled forms when editing from Review
- Smart navigation (edit → return to review)

## Component Patterns

### Form Components

All form steps follow this pattern:

```typescript
interface StepProps {
  onNext: () => void;
  onSkip: () => void;
  initialData?: T;
  onSave?: (data: T) => void;
}
```

### Validation

- Real-time validation with error states
- Error messages displayed below fields
- Errors clear when user types
- Form submit disabled until valid

### Loading States

All async operations show loading feedback:
- Button text changes (e.g., "Saving...")
- Spinners for long operations
- Progress indicators

## Key Features

### Authentication
- Passwordless magic link authentication
- Email validation
- 15-minute link expiry with countdown
- Resend functionality

### Onboarding
- **Progressive disclosure** - Complex forms use dialogs
- **Mobile responsive** - All screens adapt to mobile
- **Accessibility** - ARIA labels, keyboard navigation
- **Error handling** - Success/error states with animations
- **State persistence** - Data saved across navigation
- **Edit functionality** - Edit any step from review
- **Form validation** - Real-time error feedback
- **Trust signals** - Security badges, encryption notices

### Special Components

**Drag & Drop Upload** (`InvoicesStep`):
- Accepts: PDF, DOCX, DOC, PNG, JPG, JPEG
- Max size: 10MB per file
- Visual feedback for drag state
- Upload progress bars
- File scanning simulation

**Bank Selection** (`BankConnectStep`):
- Visual bank selection with logos
- Manual connection form
- Connection simulation with success/error states
- Security trust badges

**Customer Management** (`CustomersStep`):
- Dialog-based form
- Multi-customer support
- List with delete functionality
- Email and phone validation

## Development Guidelines

### Adding New Steps

1. Create component in `src/components/onboarding/YourStep.tsx`
2. Add to `OnboardingLayout.tsx` steps array
3. Import and add to switch statement in `src/app/onboarding/page.tsx`
4. Add state management if needed

### Styling Guidelines

- Use Material UI's `sx` prop for styling
- Follow the design system colors (no arbitrary colors)
- Use responsive values: `{ xs: value, sm: value, md: value }`
- Border radius: 2 (8px) for consistency
- Use theme typography variants when possible

### Form Validation

```typescript
const validateForm = () => {
  const errors: Record<string, string> = {};
  
  if (!field.trim()) {
    errors.field = 'Field is required';
  }
  
  setErrors(errors);
  return Object.keys(errors).length === 0;
};
```

### TypeScript

- All components use TypeScript
- Define interfaces for props
- Use proper types (avoid `any` unless necessary for MUI)
- Type all state and functions

## Environment Variables

Currently none required for demo. For production, you'll need:

```env
NEXT_PUBLIC_API_URL=your_api_url
EMAIL_SERVICE_API_KEY=your_email_service_key
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
```

## Known Issues & TODO

### Authentication
- [ ] Implement actual email sending (currently simulated)
- [ ] Add magic link token generation and validation
- [ ] Set up email service (SendGrid, AWS SES, etc.)
- [ ] Add session management

### Onboarding
- [ ] Connect to backend API for data persistence
- [ ] Implement actual Plaid integration for bank connection
- [ ] Add real document scanning/OCR for invoices
- [ ] Persist onboarding state to database
- [ ] Handle resume onboarding (save progress)

### Dashboard
- [ ] Build full dashboard UI
- [ ] Add analytics and charts
- [ ] Invoice management interface
- [ ] Customer management
- [ ] Settings page

### General
- [ ] Add unit tests
- [ ] Add E2E tests (Playwright/Cypress)
- [ ] Set up CI/CD pipeline
- [ ] Add error tracking (Sentry)
- [ ] Add analytics (Google Analytics, Mixpanel)
- [ ] Implement proper authentication (NextAuth.js recommended)
- [ ] Add database integration (Prisma + PostgreSQL recommended)

## Testing

### Manual Testing Flow

1. Start dev server: `npm run dev`
2. Visit `http://localhost:3000` (redirects to `/signup`)
3. Enter email → "Send magic link"
4. Click "Skip to Onboarding" (demo button)
5. Complete all 7 onboarding steps
6. Sign agreement → Redirect to dashboard

### Test Data

Use these for testing:
- **Email:** any valid email format
- **EIN:** `12-3456789`
- **Bank:** Any of the 4 provided options
- **Invoices:** Upload any PDF/image under 10MB

## Deployment

### Build

```bash
npm run build
```

### Deploy to Vercel

```bash
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Environment Setup

1. Add environment variables in Vercel dashboard
2. Configure domains
3. Set up email service
4. Configure Plaid (for bank connections)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- All routes are statically pre-rendered
- Images optimized with Next.js Image component (where applicable)
- Code splitting by route
- Material UI CSS-in-JS with emotion cache for SSR

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management
- Semantic HTML
- Color contrast meets WCAG AA standards

## Contributing

When adding new features:

1. Follow existing component patterns
2. Add TypeScript types
3. Use Material UI components
4. Follow design system colors/typography
5. Add responsive breakpoints
6. Test on mobile
7. Ensure no linting errors: `npm run lint`
8. Build successfully: `npm run build`

## Documentation Links

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Material UI Documentation](https://mui.com/material-ui/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

For questions or issues:
- Email: help@incoxchange.com
- Internal: Check project wiki/documentation

## License

Private - IXC Finance Application

---

**Last Updated:** November 13, 2025
**Version:** 0.1.0 (MVP - Demo Phase)
