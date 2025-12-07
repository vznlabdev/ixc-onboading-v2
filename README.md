# IncoXchange - Invoice Factoring Platform

A production-ready invoice factoring application with customer onboarding and admin dashboard. Built with Next.js 16, React 19, TypeScript, Tailwind CSS v3, and shadcn/ui components.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Access the application:
- **Main Application**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin/dashboard
- **Admin Demo Mode**: http://localhost:3000/admin/demo (auto-login)

## 📁 Project Structure

```
ixc-onboading/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── (auth)/                   # Authentication pages
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── admin/                    # Admin dashboard
│   │   │   ├── analytics/            # Analytics dashboard
│   │   │   ├── audit/                # Audit logs
│   │   │   ├── dashboard/            # Main admin dashboard
│   │   │   ├── demo/                 # Demo mode (auto-login)
│   │   │   ├── login/                # Admin login
│   │   │   └── users/                # User management
│   │   ├── dashboard/                # User dashboard
│   │   └── onboarding/               # Multi-step onboarding
│   ├── components/
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── dashboard/                # Dashboard components
│   │   └── onboarding/               # Onboarding steps
│   ├── contexts/
│   │   ├── AdminAuthContext.tsx      # Admin authentication
│   │   └── UserContext.tsx           # User state management
│   ├── hooks/
│   │   └── useKeyboardShortcuts.tsx  # Keyboard shortcuts
│   ├── lib/
│   │   ├── api.ts                    # API integration mock
│   │   ├── auditLog.ts               # Audit logging service
│   │   ├── comments.ts               # Comments system
│   │   ├── demoData.ts               # Demo data generator
│   │   ├── exportReports.ts          # Report export utilities
│   │   ├── filterPresets.ts          # Filter management
│   │   ├── mockApplications.ts       # Mock application data
│   │   ├── notifications.ts          # Email notification service
│   │   └── websocket.ts              # WebSocket service mock
│   └── utils/
│       └── localStorage.ts           # Safe localStorage wrapper
├── public/                           # Static assets
├── package.json                      # Dependencies
├── tailwind.config.js               # Tailwind configuration
├── postcss.config.mjs               # PostCSS configuration
└── tsconfig.json                    # TypeScript configuration
```

## 🛠 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.0.2 | React framework with App Router |
| **React** | 19.2.0 | UI library |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 3.4.0 | Utility-first CSS |
| **shadcn/ui** | Latest | Component library |
| **Radix UI** | Latest | Headless UI components |
| **Recharts** | 2.15.0 | Data visualization |
| **jsPDF** | 2.5.2 | PDF generation |
| **xlsx** | 0.18.5 | Excel export |
| **html2canvas** | 1.4.1 | Screenshot generation |
| **lucide-react** | 0.469.0 | Icon library |
| **sonner** | 1.7.1 | Toast notifications |

## 🎯 Key Features

### Customer Portal
- **Magic Link Authentication** - Passwordless email authentication
- **7-Step Onboarding Flow** - Business profile, customers, bank connection, invoices, review, agreement
- **Document Upload** - Drag-and-drop invoice upload with progress tracking
- **Bank Integration** - Plaid-ready bank connection flow
- **E-Signature** - Digital signature for factoring agreements
- **Application Tracking** - Real-time status updates

### Admin Dashboard
- **Application Management** - Review, approve, reject applications
- **Analytics Dashboard** - Revenue projections, risk analysis, trends
- **Document Verification** - Review uploaded documents
- **Bulk Actions** - Multi-select operations
- **Audit Trail** - Complete activity logging
- **User Management** - Admin user CRUD operations
- **Comments System** - Internal notes on applications
- **Email Notifications** - Automated email templates
- **Export Reports** - PDF, Excel, CSV export
- **Real-time Updates** - WebSocket-ready architecture

### Developer Features
- **Demo Mode** - Auto-populated test data
- **Keyboard Shortcuts** - Power user navigation
- **Loading States** - Skeleton loaders
- **Empty States** - User-friendly empty views
- **Error Boundaries** - Graceful error handling
- **Mobile Responsive** - Full mobile support
- **Dark Mode Ready** - Theme variables configured
- **TypeScript** - Full type coverage
- **SSR Safe** - No hydration errors

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
# API Configuration (Required for production)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Email Service (Required for magic links)
EMAIL_SERVICE_API_KEY=your_sendgrid_key
EMAIL_FROM_ADDRESS=noreply@incoxchange.com

# Plaid Integration (Required for bank connections)
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox

# Database (Required for production)
DATABASE_URL=postgresql://user:password@localhost:5432/incoxchange

# Session Secret (Required for production)
SESSION_SECRET=your-secret-key-min-32-chars

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Admin Credentials (Demo)

For demo/development, use these credentials:
- **Email**: admin@incoxchange.com
- **Password**: admin123

## 📝 API Endpoints Required

The application expects these API endpoints (currently mocked in `lib/api.ts`):

### Authentication
- `POST /api/auth/magic-link` - Send magic link email
- `POST /api/auth/verify` - Verify magic link token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/session` - Get current session

### Applications
- `GET /api/applications` - List applications
- `GET /api/applications/:id` - Get application details
- `POST /api/applications` - Submit new application
- `PUT /api/applications/:id` - Update application
- `PATCH /api/applications/:id/status` - Update status

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Dashboard statistics
- `POST /api/admin/applications/:id/approve` - Approve application
- `POST /api/admin/applications/:id/reject` - Reject application
- `GET /api/admin/audit-logs` - Get audit logs

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:id` - Download document
- `POST /api/documents/:id/verify` - Verify document

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or link to GitHub for automatic deployments
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --production
EXPOSE 3000
CMD ["npm", "start"]
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
NODE_ENV=production npm start
```

## 🧪 Testing

### Manual Testing Flow

1. **Customer Onboarding**:
   ```
   /signup → Enter email → Verify → Onboarding (7 steps) → Dashboard
   ```

2. **Admin Flow**:
   ```
   /admin/login → Dashboard → Review applications → Approve/Reject
   ```

3. **Demo Mode**:
   ```
   /admin/demo → Auto-login → Explore all features
   ```

### Test Data

- **EIN Format**: `12-3456789`
- **Phone Format**: `(555) 123-4567`
- **Email**: Any valid email format
- **Invoice Upload**: PDF, PNG, JPG (max 10MB)

## 🔐 Security Considerations

### Production Requirements

1. **Authentication**:
   - Implement JWT or session-based auth
   - Add rate limiting for magic links
   - Implement 2FA for admin users
   - Add CAPTCHA for public forms

2. **Data Protection**:
   - Enable HTTPS only
   - Implement CSRF protection
   - Add Content Security Policy headers
   - Sanitize all user inputs
   - Encrypt sensitive data at rest

3. **File Upload**:
   - Validate file types server-side
   - Scan for malware
   - Store files in secure cloud storage
   - Implement access controls

4. **API Security**:
   - Add API rate limiting
   - Implement request validation
   - Add API authentication
   - Log all API access

## 🎨 Customization

### Theme Colors

Edit `src/app/globals.css`:

```css
:root {
  --primary: 222.2 47.4% 11.2%;    /* Main brand color */
  --secondary: 210 40% 96.1%;       /* Secondary color */
  --accent: 210 40% 96.1%;          /* Accent color */
  --destructive: 0 84.2% 60.2%;     /* Error color */
}
```

### Adding New Components

1. Install shadcn/ui component:
   ```bash
   npx shadcn-ui@latest add [component-name]
   ```

2. Components are added to `src/components/ui/`

### Adding New Onboarding Steps

1. Create component in `src/components/onboarding/NewStep.tsx`
2. Add to steps array in `OnboardingLayout.tsx`
3. Import in `src/app/onboarding/page.tsx`
4. Update step count in layout

## 📚 Development Guidelines

### Code Style

```typescript
// Use functional components with TypeScript
interface Props {
  title: string;
  onSubmit: (data: FormData) => void;
}

export default function Component({ title, onSubmit }: Props) {
  // Implementation
}
```

### State Management

```typescript
// Use contexts for global state
import { useUser } from '@/contexts/UserContext';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

// Use localStorage safely
import { safeLocalStorage } from '@/utils/localStorage';
```

### Error Handling

```typescript
try {
  const result = await api.submitApplication(data);
  toast.success('Application submitted');
} catch (error) {
  console.error('Submission failed:', error);
  toast.error('Failed to submit application');
}
```

## 🐛 Known Limitations

### Demo/Mock Features
- Email sending is simulated (shows toast instead)
- Bank connections use mock data (Plaid integration ready)
- WebSocket connections are simulated
- Document scanning is simulated
- All data is stored in localStorage (not persistent)

### Production TODO
- [ ] Implement backend API
- [ ] Set up database (PostgreSQL recommended)
- [ ] Configure email service (SendGrid/AWS SES)
- [ ] Implement Plaid for real bank connections
- [ ] Add document OCR service
- [ ] Set up file storage (S3/CloudStorage)
- [ ] Implement WebSocket server
- [ ] Add monitoring (Sentry/DataDog)
- [ ] Set up CI/CD pipeline
- [ ] Add automated testing

## 📞 Support

For questions or issues:
- Review the [Architecture Documentation](./ARCHITECTURE.md)
- Check the [Developer Guide](./DEVELOPER_GUIDE.md)
- Review the [API Documentation](./API_DOCUMENTATION.md)

## 📄 License

Private - IncoXchange © 2025

---

**Version**: 3.0.0  
**Last Updated**: December 2025  
**Status**: Production Ready (Frontend Complete)