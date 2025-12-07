# Developer Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Development Setup](#development-setup)
3. [Project Structure](#project-structure)
4. [Key Concepts](#key-concepts)
5. [Common Tasks](#common-tasks)
6. [Testing Guide](#testing-guide)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm 8.0 or higher
- Git
- VS Code (recommended) or your preferred IDE

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/incoxchange/ixc-onboarding.git
   cd ixc-onboarding
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Main app: http://localhost:3000
   - Admin: http://localhost:3000/admin/dashboard

## Development Setup

### VS Code Configuration

1. **Recommended Extensions**
   ```json
   {
     "recommendations": [
       "dbaeumer.vscode-eslint",
       "esbenp.prettier-vscode",
       "bradlc.vscode-tailwindcss",
       "prisma.prisma",
       "ms-vscode.vscode-typescript-next"
     ]
   }
   ```

2. **Settings** (`.vscode/settings.json`)
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "tailwindCSS.experimental.classRegex": [
       ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
     ]
   }
   ```

### Git Hooks Setup

1. **Install Husky**
   ```bash
   npm install --save-dev husky
   npx husky init
   ```

2. **Add pre-commit hook**
   ```bash
   echo "npm run lint && npm run type-check" > .husky/pre-commit
   ```

### Database Setup (Production)

1. **PostgreSQL Installation**
   ```bash
   # Using Docker
   docker run --name incoxchange-db \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=incoxchange \
     -p 5432:5432 \
     -d postgres:15
   ```

2. **Run Migrations** (when implemented)
   ```bash
   npm run db:migrate
   npm run db:seed # Optional: seed with test data
   ```

## Project Structure

### Directory Overview

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth group routes
│   ├── admin/             # Admin routes
│   ├── api/               # API routes (future)
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Base UI components
│   └── [feature]/        # Feature components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Business logic
├── utils/                # Utility functions
└── types/                # TypeScript types (future)
```

### File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| **Components** | PascalCase | `UserProfile.tsx` |
| **Utilities** | camelCase | `formatDate.ts` |
| **Hooks** | camelCase with 'use' | `useAuth.ts` |
| **Constants** | UPPER_SNAKE_CASE | `API_ENDPOINTS.ts` |
| **Types** | PascalCase | `UserType.ts` |

## Key Concepts

### 1. Component Development

#### Creating a New Component

```typescript
// src/components/feature/NewComponent.tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface NewComponentProps {
  title: string;
  className?: string;
  children?: React.ReactNode;
}

export default function NewComponent({ 
  title, 
  className, 
  children 
}: NewComponentProps) {
  return (
    <div className={cn('p-4 border rounded', className)}>
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}
```

#### Using shadcn/ui Components

```bash
# Add a new component
npx shadcn-ui@latest add dialog

# Component will be added to src/components/ui/
```

### 2. State Management

#### Using UserContext

```typescript
import { useUser } from '@/contexts/UserContext';

export default function MyComponent() {
  const { 
    userEmail, 
    onboardingData, 
    saveOnboardingData 
  } = useUser();

  const handleSave = (data: Partial<OnboardingData>) => {
    saveOnboardingData(data);
  };

  return (
    <div>
      <p>Welcome, {userEmail}</p>
      {/* Component content */}
    </div>
  );
}
```

#### Creating a New Context

```typescript
// src/contexts/NewContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

interface NewContextType {
  value: string;
  setValue: (value: string) => void;
}

const NewContext = createContext<NewContextType | undefined>(undefined);

export function NewProvider({ children }: { children: React.ReactNode }) {
  const [value, setValue] = useState('');

  return (
    <NewContext.Provider value={{ value, setValue }}>
      {children}
    </NewContext.Provider>
  );
}

export function useNew() {
  const context = useContext(NewContext);
  if (!context) {
    throw new Error('useNew must be used within NewProvider');
  }
  return context;
}
```

### 3. API Integration

#### Creating an API Service

```typescript
// src/lib/services/userService.ts
import { Application } from '@/lib/mockApplications';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const userService = {
  async getApplications(): Promise<Application[]> {
    const response = await fetch(`${API_BASE}/api/applications`);
    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
  },

  async submitApplication(data: Partial<Application>): Promise<Application> {
    const response = await fetch(`${API_BASE}/api/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to submit application');
    return response.json();
  },
};
```

### 4. Form Handling

#### Using React Hook Form (if added)

```typescript
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('email', { required: 'Email is required' })}
        placeholder="Email"
      />
      {errors.email && <span>{errors.email.message}</span>}
      
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## Common Tasks

### Adding a New Page

1. **Create the page file**
   ```tsx
   // src/app/new-page/page.tsx
   export default function NewPage() {
     return (
       <div>
         <h1>New Page</h1>
       </div>
     );
   }
   ```

2. **Add metadata (optional)**
   ```tsx
   export const metadata = {
     title: 'New Page | IncoXchange',
     description: 'Description of the new page',
   };
   ```

### Adding a New API Route

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Handle GET request
  return NextResponse.json({ message: 'Success' });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  // Handle POST request
  return NextResponse.json({ data: body });
}
```

### Working with LocalStorage

```typescript
import { safeLocalStorage } from '@/utils/localStorage';

// Save data
safeLocalStorage.setItem('key', { data: 'value' });

// Retrieve data
const data = safeLocalStorage.getItem('key');

// Remove data
safeLocalStorage.removeItem('key');
```

### Adding Animations

```tsx
// Using Tailwind animations
<div className="animate-fade-in">
  Content with fade-in animation
</div>

// Using custom animations
<div className="transition-all duration-300 hover:scale-105">
  Hover to scale
</div>
```

### Implementing Dark Mode

```tsx
// In your component
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle theme
    </button>
  );
}
```

## Testing Guide

### Unit Testing Setup

1. **Install testing dependencies**
   ```bash
   npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
   ```

2. **Create test file**
   ```typescript
   // src/components/Button.test.tsx
   import { render, screen } from '@testing-library/react';
   import Button from './Button';

   describe('Button', () => {
     it('renders with text', () => {
       render(<Button>Click me</Button>);
       expect(screen.getByText('Click me')).toBeInTheDocument();
     });
   });
   ```

3. **Run tests**
   ```bash
   npm test
   ```

### E2E Testing with Playwright

1. **Install Playwright**
   ```bash
   npm install --save-dev @playwright/test
   npx playwright install
   ```

2. **Create E2E test**
   ```typescript
   // tests/onboarding.spec.ts
   import { test, expect } from '@playwright/test';

   test('complete onboarding flow', async ({ page }) => {
     await page.goto('http://localhost:3000');
     await page.click('text=Get Started');
     // ... rest of the test
   });
   ```

3. **Run E2E tests**
   ```bash
   npx playwright test
   ```

## Deployment

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Environment Variables**
   - Set in Vercel dashboard
   - Or use `vercel env add`

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t incoxchange-app .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:3000 incoxchange-app
   ```

### Manual Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start production server**
   ```bash
   NODE_ENV=production npm start
   ```

## Troubleshooting

### Common Issues

#### 1. Hydration Errors
**Problem**: "Text content does not match server-rendered HTML"
**Solution**:
```typescript
// Use dynamic import with ssr: false
import dynamic from 'next/dynamic';

const ClientComponent = dynamic(() => import('./ClientComponent'), {
  ssr: false,
});
```

#### 2. Module Not Found
**Problem**: "Module not found: Can't resolve..."
**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

#### 3. TypeScript Errors
**Problem**: Type errors in build
**Solution**:
```bash
# Check types
npm run type-check

# Generate types for shadcn components
npx shadcn-ui@latest add [component] --overwrite
```

#### 4. Tailwind Classes Not Working
**Problem**: Tailwind classes not applying
**Solution**:
- Check `tailwind.config.js` content array
- Restart dev server
- Clear browser cache

#### 5. LocalStorage Not Available
**Problem**: "localStorage is not defined"
**Solution**:
```typescript
// Check if window is defined
if (typeof window !== 'undefined') {
  localStorage.setItem('key', 'value');
}
```

### Debug Mode

Enable debug mode for more verbose logging:

```typescript
// In .env.local
NEXT_PUBLIC_DEBUG=true

// In your code
if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
  console.log('Debug info:', data);
}
```

### Performance Profiling

1. **Use React DevTools Profiler**
   - Install React DevTools extension
   - Open Profiler tab
   - Record interactions

2. **Use Lighthouse**
   ```bash
   # Run Lighthouse audit
   npx lighthouse http://localhost:3000
   ```

3. **Bundle Analysis**
   ```bash
   # Install analyzer
   npm install --save-dev @next/bundle-analyzer

   # Run analysis
   ANALYZE=true npm run build
   ```

## Best Practices

### Code Quality
- Write self-documenting code
- Add JSDoc comments for complex functions
- Use TypeScript strict mode
- Follow ESLint rules
- Format with Prettier

### Performance
- Use dynamic imports for heavy components
- Implement proper loading states
- Optimize images with next/image
- Use React.memo for expensive components
- Implement virtualization for long lists

### Security
- Sanitize user inputs
- Use environment variables for secrets
- Implement proper authentication
- Validate data on both client and server
- Use HTTPS in production

### Accessibility
- Use semantic HTML
- Add ARIA labels
- Ensure keyboard navigation
- Test with screen readers
- Maintain color contrast ratios

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Radix UI](https://radix-ui.com)

### Tools
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
- [Postman](https://www.postman.com/) for API testing
- [TablePlus](https://tableplus.com/) for database management

### Learning Resources
- [Next.js Learn Course](https://nextjs.org/learn)
- [Tailwind CSS Course](https://tailwindcss.com/course)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Patterns](https://reactpatterns.com/)

---

**Last Updated**: December 2025  
**Version**: 1.0.0
