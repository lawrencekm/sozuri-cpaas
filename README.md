# SOZURI CPaaS Portal

Key Features:

- AI-First Approach: Intelligent recommendations and optimizations based on communication patterns
- Industry-Specific Solutions: Tailored features for Retail, Healthcare, Financial Services, and Education
- Enterprise-Grade Security: Compliance with industry standards and robust security measures
- Developer-Friendly: Comprehensive API documentation, SDKs, and webhooks for seamless integration

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Backend API service (see Backend Configuration)

### Installation

Install dependencies:
```bash
npm install
# or
yarn install
```

Set up environment variables:
```bash
cp .env.example .env.local
```
Edit .env.local with your configuration (see Environment Variables section).

Run the development server:
```bash
npm run dev
# or
yarn dev
```

Open http://localhost:3000 in your browser.

Backend Configuration
The Portal is designed to work with a RESTful API backend. This section outlines how to configure the backend to work with the portal.

API Structure
The frontend expects the following API endpoints:

Authentication


POST /api/auth/login: User login

POST /api/auth/register: User registration

POST /api/auth/logout: User logout

GET /api/auth/me: Get current user information


Projects


GET /api/projects: List all projects

GET /api/projects/:id: Get project details

POST /api/projects: Create a new project

PUT /api/projects/:id: Update a project

DELETE /api/projects/:id: Delete a project


Campaigns


GET /api/campaigns: List all campaigns

GET /api/campaigns/:id: Get campaign details

POST /api/campaigns: Create a new campaign

PUT /api/campaigns/:id: Update a campaign

DELETE /api/campaigns/:id: Delete a campaign


Messaging


POST /api/messaging/sms/send: Send SMS message

POST /api/messaging/whatsapp/send: Send WhatsApp message

POST /api/messaging/viber/send: Send Viber message

POST /api/messaging/rcs/send: Send RCS message


Templates


GET /api/templates: List all templates

GET /api/templates/:id: Get template details

POST /api/templates: Create a new template

PUT /api/templates/:id: Update a template

DELETE /api/templates/:id: Delete a template


Contacts


GET /api/contacts: List all contacts

GET /api/contacts/:id: Get contact details

POST /api/contacts: Create a new contact

PUT /api/contacts/:id: Update a contact

DELETE /api/contacts/:id: Delete a contact


Analytics


GET /api/analytics/overview: Get overview analytics

GET /api/analytics/messaging: Get messaging analytics

GET /api/analytics/voice: Get voice analytics

GET /api/analytics/engagement: Get engagement analytics


Environment Variables
Create a .env.local file with the following variables:
```
API Configuration
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api

Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

Service Provider API Keys
SMS_API_KEY=your-sms-api-key
WHATSAPP_API_KEY=your-whatsapp-api-key
VIBER_API_KEY=your-viber-api-key
RCS_API_KEY=your-rcs-api-key
VOICE_API_KEY=your-voice-api-key

Database (if using direct database connection)
DATABASE_URL=your-database-connection-string

Updated Installation Steps

# New dependencies
npm install @tanstack/react-query @tanstack/react-query-devtools \
  pino pino-pretty react-error-boundary

## Error Handling Architecture

The application implements a robust error handling system:

1. **Error Boundary Components**
   - Hierarchical error boundaries to contain errors
   - Application-level error boundary in `ErrorProvider`
   - Component-specific error boundary for isolated error handling

2. **Centralized Error Management**
   - All errors flow through `lib/error-handler.ts` for consistent handling
   - Errors are properly tagged and categorized for better analysis
   - Custom error severity levels for prioritizing issues

Monitoring & Observability

1. Health Checks & Diagnostics

// Implemented health checks
export async function healthCheck() {
  const [apiHealth, dbHealth] = await Promise.all([
    fetch('/api/health'),
    checkDatabaseConnection()
  ])

  return {
    status: apiHealth.ok && dbHealth ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    dependencies: {
      api: apiHealth.status,
      database: dbHealth ? 'connected' : 'disconnected'
    }
  }
}

Added health check endpoints for all services
Implemented system diagnostics for troubleshooting
Created a status dashboard for monitoring system health

2. Analytics & Metrics

Implemented comprehensive analytics tracking
Added performance metrics for all key operations
Created dashboards for monitoring user engagement
Implemented real-time analytics for messaging performance

3. AI-Powered Insights

Integrated AI-powered analytics for pattern recognition
Added predictive analytics for campaign performance
Implemented anomaly detection for early issue identification
Created personalized recommendations based on usage patterns
