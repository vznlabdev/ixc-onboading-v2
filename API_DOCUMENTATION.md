# API Documentation

## Overview

This document describes the API endpoints required for the IncoXchange platform. Currently, these endpoints are mocked in the frontend but this documentation serves as the specification for backend implementation.

## Base URL

```
Development: http://localhost:3001/api
Staging: https://staging-api.incoxchange.com/api
Production: https://api.incoxchange.com/api
```

## Authentication

### Headers

All authenticated requests must include:

```http
Authorization: Bearer <token>
Content-Type: application/json
```

### Token Format

JWT tokens with the following payload:

```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "role": "customer|admin",
  "exp": 1234567890
}
```

## API Endpoints

### Authentication Endpoints

#### 1. Send Magic Link

```http
POST /auth/magic-link
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Magic link sent to email",
  "expiresIn": 900
}
```

**Error Response (400):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_EMAIL",
    "message": "Please provide a valid email address"
  }
}
```

---

#### 2. Verify Magic Link

```http
POST /auth/verify
```

**Request Body:**
```json
{
  "token": "magic-link-token"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "profile": {
        "fullName": "John Doe",
        "phoneNumber": "+1234567890"
      }
    }
  }
}
```

---

#### 3. Refresh Token

```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "refresh-token"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-token"
  }
}
```

---

#### 4. Logout

```http
POST /auth/logout
```

**Headers:**
```http
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### User Endpoints

#### 5. Get Current User

```http
GET /users/me
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "profile": {
      "fullName": "John Doe",
      "phoneNumber": "+1234567890",
      "jobTitle": "CEO"
    },
    "createdAt": "2025-01-01T00:00:00Z",
    "lastLogin": "2025-01-02T00:00:00Z"
  }
}
```

---

#### 6. Update User Profile

```http
PUT /users/me
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phoneNumber": "+1234567890",
  "jobTitle": "CEO"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "profile": {
      "fullName": "John Doe",
      "phoneNumber": "+1234567890",
      "jobTitle": "CEO"
    }
  }
}
```

---

### Application Endpoints

#### 7. Submit Application

```http
POST /applications
```

**Request Body:**
```json
{
  "businessProfile": {
    "businessName": "Acme Corp",
    "businessType": "LLC",
    "industry": "Technology",
    "ein": "12-3456789",
    "state": "CA",
    "city": "San Francisco",
    "street": "123 Main St",
    "building": "Suite 100",
    "zip": "94105"
  },
  "customers": [
    {
      "customerName": "Customer Inc",
      "contactPerson": "Jane Smith",
      "email": "jane@customer.com",
      "phone": "+1234567890",
      "billingAddress": "456 Oak Ave"
    }
  ],
  "bankConnection": {
    "bankId": "bank_123",
    "bankName": "Chase",
    "isManual": false
  },
  "documents": ["doc_id_1", "doc_id_2"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "APP-001",
    "status": "under_review",
    "submittedAt": "2025-01-01T00:00:00Z",
    "businessName": "Acme Corp",
    "invoiceValue": 125000
  }
}
```

---

#### 8. Get User Applications

```http
GET /applications
```

**Query Parameters:**
- `status`: Filter by status (pending, under_review, approved, rejected)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "APP-001",
      "businessName": "Acme Corp",
      "status": "under_review",
      "submittedAt": "2025-01-01T00:00:00Z",
      "invoiceValue": 125000,
      "riskScore": 82
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "hasMore": true
  }
}
```

---

#### 9. Get Application Details

```http
GET /applications/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "APP-001",
    "userId": "user_123",
    "status": "under_review",
    "businessProfile": {
      "businessName": "Acme Corp",
      "businessType": "LLC",
      "industry": "Technology",
      "ein": "12-3456789",
      "address": {
        "state": "CA",
        "city": "San Francisco",
        "street": "123 Main St",
        "building": "Suite 100",
        "zip": "94105"
      }
    },
    "customers": [...],
    "bankConnection": {...},
    "documents": [...],
    "submittedAt": "2025-01-01T00:00:00Z",
    "reviewedAt": null,
    "decidedAt": null,
    "creditTerms": null
  }
}
```

---

### Document Endpoints

#### 10. Upload Document

```http
POST /documents/upload
```

**Request:** `multipart/form-data`
- `file`: File to upload
- `type`: Document type (invoice, bank_statement, agreement)
- `applicationId`: Associated application ID (optional)

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "doc_123",
    "filename": "invoice.pdf",
    "type": "invoice",
    "size": 1024000,
    "url": "https://storage.incoxchange.com/docs/doc_123.pdf",
    "uploadedAt": "2025-01-01T00:00:00Z"
  }
}
```

---

#### 11. Get Document

```http
GET /documents/:id
```

**Response (200 OK):**
Returns file content with appropriate Content-Type header

---

#### 12. Delete Document

```http
DELETE /documents/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

---

### Admin Endpoints

#### 13. Admin Login

```http
POST /admin/auth/login
```

**Request Body:**
```json
{
  "email": "admin@incoxchange.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "admin-jwt-token",
    "user": {
      "id": "admin_123",
      "email": "admin@incoxchange.com",
      "name": "Admin User",
      "role": "admin",
      "permissions": ["read", "write", "delete", "approve"]
    }
  }
}
```

---

#### 14. Get All Applications (Admin)

```http
GET /admin/applications
```

**Query Parameters:**
- `status`: Filter by status
- `riskScore`: Filter by risk score range (e.g., "70-100")
- `dateRange`: Filter by date (e.g., "7d", "30d", "custom")
- `search`: Search by business name or ID
- `page`: Page number
- `limit`: Items per page
- `sortBy`: Sort field (submittedAt, businessName, riskScore)
- `sortOrder`: asc or desc

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "APP-001",
      "userId": "user_123",
      "userEmail": "user@example.com",
      "businessName": "Acme Corp",
      "status": "under_review",
      "riskScore": 82,
      "invoiceValue": 125000,
      "invoiceCount": 8,
      "submittedAt": "2025-01-01T00:00:00Z",
      "assignedTo": "admin_456"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasMore": true
  },
  "stats": {
    "total": 150,
    "pending": 45,
    "approved": 80,
    "rejected": 25
  }
}
```

---

#### 15. Approve Application

```http
POST /admin/applications/:id/approve
```

**Request Body:**
```json
{
  "creditLimit": 100000,
  "factoringRate": 3.5,
  "paymentTerms": 30,
  "notes": "Approved based on strong financials"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "APP-001",
    "status": "approved",
    "approvedAt": "2025-01-02T00:00:00Z",
    "approvedBy": "admin_123",
    "creditTerms": {
      "creditLimit": 100000,
      "factoringRate": 3.5,
      "paymentTerms": 30
    }
  }
}
```

---

#### 16. Reject Application

```http
POST /admin/applications/:id/reject
```

**Request Body:**
```json
{
  "reason": "Insufficient documentation",
  "notes": "Missing bank statements for last 3 months"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "APP-001",
    "status": "rejected",
    "rejectedAt": "2025-01-02T00:00:00Z",
    "rejectedBy": "admin_123",
    "rejectionReason": "Insufficient documentation"
  }
}
```

---

#### 17. Get Dashboard Statistics

```http
GET /admin/stats
```

**Query Parameters:**
- `period`: Time period (7d, 30d, 90d, 1y)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "applications": {
      "total": 150,
      "pending": 45,
      "approved": 80,
      "rejected": 25,
      "trend": "+12%"
    },
    "revenue": {
      "total": 1900000,
      "projected": 2500000,
      "trend": "+8%"
    },
    "approvalRate": {
      "current": 76,
      "previous": 72,
      "trend": "+4%"
    },
    "avgProcessingTime": {
      "hours": 48,
      "trend": "-12%"
    },
    "charts": {
      "dailyApplications": [...],
      "riskDistribution": [...],
      "revenueProjection": [...]
    }
  }
}
```

---

#### 18. Get Audit Logs

```http
GET /admin/audit-logs
```

**Query Parameters:**
- `userId`: Filter by user
- `action`: Filter by action type
- `targetId`: Filter by target resource
- `startDate`: Start date (ISO 8601)
- `endDate`: End date (ISO 8601)
- `page`: Page number
- `limit`: Items per page

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "log_123",
      "userId": "admin_123",
      "userName": "Admin User",
      "action": "APPLICATION_APPROVED",
      "targetType": "application",
      "targetId": "APP-001",
      "details": {
        "creditLimit": 100000,
        "factoringRate": 3.5
      },
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2025-01-02T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 500,
    "hasMore": true
  }
}
```

---

### Comment Endpoints

#### 19. Add Comment

```http
POST /applications/:id/comments
```

**Request Body:**
```json
{
  "content": "Application looks good, pending final review",
  "isInternal": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "comment_123",
    "applicationId": "APP-001",
    "userId": "admin_123",
    "userName": "Admin User",
    "content": "Application looks good, pending final review",
    "isInternal": true,
    "createdAt": "2025-01-02T00:00:00Z"
  }
}
```

---

#### 20. Get Comments

```http
GET /applications/:id/comments
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "comment_123",
      "userId": "admin_123",
      "userName": "Admin User",
      "content": "Application looks good",
      "isInternal": true,
      "createdAt": "2025-01-02T00:00:00Z",
      "updatedAt": null
    }
  ]
}
```

---

### Notification Endpoints

#### 21. Get Notification Preferences

```http
GET /users/me/notifications
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "email": {
      "applicationUpdates": true,
      "marketingEmails": false,
      "weeklyDigest": true
    },
    "push": {
      "applicationUpdates": true,
      "announcements": false
    }
  }
}
```

---

#### 22. Update Notification Preferences

```http
PUT /users/me/notifications
```

**Request Body:**
```json
{
  "email": {
    "applicationUpdates": true,
    "marketingEmails": false,
    "weeklyDigest": true
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Preferences updated successfully"
}
```

---

### Export Endpoints

#### 23. Export Applications

```http
POST /admin/export/applications
```

**Request Body:**
```json
{
  "format": "xlsx",
  "filters": {
    "status": ["approved", "under_review"],
    "dateRange": {
      "start": "2025-01-01",
      "end": "2025-01-31"
    }
  },
  "fields": ["id", "businessName", "status", "invoiceValue", "submittedAt"]
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://api.incoxchange.com/exports/export_123.xlsx",
    "expiresAt": "2025-01-03T00:00:00Z"
  }
}
```

---

### WebSocket Events

#### Connection

```javascript
const ws = new WebSocket('wss://api.incoxchange.com/ws');

ws.onopen = () => {
  // Send authentication
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'jwt-token'
  }));
};
```

#### Events

**Application Status Update**
```json
{
  "type": "application:updated",
  "data": {
    "id": "APP-001",
    "status": "approved",
    "updatedAt": "2025-01-02T00:00:00Z"
  }
}
```

**New Comment**
```json
{
  "type": "comment:added",
  "data": {
    "applicationId": "APP-001",
    "comment": {
      "id": "comment_123",
      "content": "New comment added",
      "userName": "Admin User"
    }
  }
}
```

**Real-time Statistics**
```json
{
  "type": "stats:updated",
  "data": {
    "totalApplications": 151,
    "pendingReview": 46,
    "approvalRate": 76.5
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Missing or invalid authentication |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `VALIDATION_ERROR` | Invalid request data |
| `DUPLICATE_ENTRY` | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |
| `SERVICE_UNAVAILABLE` | Service temporarily down |

## Rate Limiting

- **Authentication endpoints**: 5 requests per minute
- **Public endpoints**: 60 requests per minute
- **Authenticated endpoints**: 300 requests per minute
- **Admin endpoints**: 600 requests per minute

Rate limit headers:
```http
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 299
X-RateLimit-Reset: 1234567890
```

## Pagination

Standard pagination format:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasMore": true,
    "hasPrevious": false
  }
}
```

## Versioning

API versioning through headers:
```http
Accept: application/vnd.incoxchange.v1+json
```

Or URL versioning:
```
https://api.incoxchange.com/v1/...
```

## Testing

### Postman Collection

Import the Postman collection from `postman/incoxchange-api.json`

### cURL Examples

```bash
# Authentication
curl -X POST https://api.incoxchange.com/api/auth/magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Get applications
curl -X GET https://api.incoxchange.com/api/applications \
  -H "Authorization: Bearer <token>"

# Upload document
curl -X POST https://api.incoxchange.com/api/documents/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@invoice.pdf" \
  -F "type=invoice"
```

---

**Last Updated**: December 2025  
**Version**: 1.0.0  
**API Version**: v1
