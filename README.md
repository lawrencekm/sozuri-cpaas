## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Backend Configuration](#backend-configuration)
  - [API Structure](#api-structure)
  - [Environment Variables](#environment-variables)
  - [Authentication](#authentication)
  - [Database Setup](#database-setup)
- [Integration Points](#integration-points)
  - [Messaging Services](#messaging-services)
  - [Voice Services](#voice-services)
  - [Chat Applications](#chat-applications)
- [Data Models](#data-models)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Recent Improvements & Best Practices](#recent-improvements-best-practices)
  - [Frontend Architecture Updates](#frontend-architecture-updates)
  - [Updated Development Guidelines](#updated-development-guidelines)
  - [Updated Environment Variables](#updated-environment-variables)
  - [Updated Installation Steps](#updated-installation-steps)
  - [Monitoring & Observability](#monitoring-observability)

## Overview

SOZURI CPaaS (Communications Platform as a Service) is an enterprise-grade Next.js application that provides a comprehensive solution for managing omnichannel communications. The platform enables businesses to engage with customers through SMS, WhatsApp, Viber, RCS messaging, voice calls, and chat applications, all from a unified dashboard.

Built with a focus on enterprise needs, SOZURI CPaaS offers industry-specific solutions, AI-powered recommendations, advanced analytics, and robust security features. The platform's intuitive interface, combined with powerful developer tools, makes it suitable for businesses of all sizes looking to enhance their customer communications strategy.

Key differentiators:
- **AI-First Approach**: Intelligent recommendations and optimizations based on communication patterns
- **Industry-Specific Solutions**: Tailored features for Retail, Healthcare, Financial Services, and Education
- **Enterprise-Grade Security**: Compliance with industry standards and robust security measures
- **Developer-Friendly**: Comprehensive API documentation, SDKs, and webhooks for seamless integration

## Features

- **Multi-channel Messaging**: SMS, WhatsApp, Viber, and RCS messaging from a unified platform
- **Voice Services**: Voice calls, IVR systems, and AI-powered voice bots
- **Chat Applications**: Live chat, chatbots, and omnichannel inbox
- **Project Management**: Organize communications by projects with team collaboration
- **Campaign Management**: Create, schedule, and manage messaging campaigns
- **Advanced Analytics**: Real-time tracking and analysis of communication performance
- **Template Management**: Create, test, and reuse message templates with personalization
- **Contact Management**: Manage audience and contact lists with segmentation
- **AI Suggestions**: Intelligent recommendations to optimize messaging strategy
- **Industry Solutions**: Tailored features for Retail, Healthcare, Financial Services, and Education
- **Enterprise Security**: Role-based access control, audit logs, and compliance features
- **Developer Tools**: Comprehensive API documentation, SDKs, and webhooks

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Backend API service (see Backend Configuration)


2. Install dependencies:
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   Edit `.env.local` with your configuration (see Environment Variables section).

4. Run the development server:
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend Configuration

The SOZURI CPaaS Portal is designed to work with a RESTful API backend. This section outlines how to configure your backend to work with the portal.

### API Structure

The frontend expects the following API endpoints:

#### Authentication
- `POST /api/auth/login`: User login
- `POST /api/auth/register`: User registration
- `POST /api/auth/logout`: User logout
- `GET /api/auth/me`: Get current user information

#### Projects
- `GET /api/projects`: List all projects
- `GET /api/projects/:id`: Get project details
- `POST /api/projects`: Create a new project
- `PUT /api/projects/:id`: Update a project
- `DELETE /api/projects/:id`: Delete a project

#### Campaigns
- `GET /api/campaigns`: List all campaigns
- `GET /api/campaigns/:id`: Get campaign details
- `POST /api/campaigns`: Create a new campaign
- `PUT /api/campaigns/:id`: Update a campaign
- `DELETE /api/campaigns/:id`: Delete a campaign

#### Messaging
- `POST /api/messaging/sms/send`: Send SMS message
- `POST /api/messaging/whatsapp/send`: Send WhatsApp message
- `POST /api/messaging/viber/send`: Send Viber message
- `POST /api/messaging/rcs/send`: Send RCS message

#### Templates
- `GET /api/templates`: List all templates
- `GET /api/templates/:id`: Get template details
- `POST /api/templates`: Create a new template
- `PUT /api/templates/:id`: Update a template
- `DELETE /api/templates/:id`: Delete a template

#### Contacts
- `GET /api/contacts`: List all contacts
- `GET /api/contacts/:id`: Get contact details
- `POST /api/contacts`: Create a new contact
- `PUT /api/contacts/:id`: Update a contact
- `DELETE /api/contacts/:id`: Delete a contact

#### Analytics
- `GET /api/analytics/overview`: Get overview analytics
- `GET /api/analytics/messaging`: Get messaging analytics
- `GET /api/analytics/voice`: Get voice analytics
- `GET /api/analytics/engagement`: Get engagement analytics

### Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`
# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Service Provider API Keys
SMS_API_KEY=your-sms-api-key
WHATSAPP_API_KEY=your-whatsapp-api-key
VIBER_API_KEY=your-viber-api-key
RCS_API_KEY=your-rcs-api-key
VOICE_API_KEY=your-voice-api-key

# Database (if using direct database connection)
DATABASE_URL=your-database-connection-string
\`\`\`

### Authentication

The portal uses NextAuth.js for authentication. Configure your backend to support JWT authentication with the following flow:

1. User submits credentials to `/api/auth/login`
2. Backend validates credentials and returns a JWT token
3. Frontend stores the token and includes it in the `Authorization` header for subsequent requests
4. Backend validates the token for protected endpoints

Example JWT payload structure:

\`\`\`json
{
  "id": "user-id",
  "email": "user@example.com",
  "name": "User Name",
  "role": "admin",
  "iat": 1625097600,
  "exp": 1625184000
}
\`\`\`

### Database Setup

The portal is designed to work with any database system. Here's a recommended schema structure:

#### Users
- id (primary key)
- email
- password (hashed)
- name
- role
- created_at
- updated_at

#### Projects
- id (primary key)
- name
- description
- type (marketing, transactional, customer-service, alerts)
- user_id (foreign key to Users)
- created_at
- updated_at

#### Campaigns
- id (primary key)
- name
- description
- project_id (foreign key to Projects)
- channel (sms, whatsapp, viber, rcs, voice)
- status (draft, scheduled, active, completed)
- scheduled_at
- created_at
- updated_at

#### Messages
- id (primary key)
- campaign_id (foreign key to Campaigns)
- content
- recipient
- status (pending, sent, delivered, failed)
- sent_at
- delivered_at
- created_at
- updated_at

#### Templates
- id (primary key)
- name
- content
- type (transactional, marketing, notification, reminder)
- user_id (foreign key to Users)
- created_at
- updated_at

#### Contacts
- id (primary key)
- name
- phone
- email
- attributes (JSON)
- user_id (foreign key to Users)
- created_at
- updated_at

## Integration Points

### Messaging Services

The portal is designed to integrate with various messaging service providers. Configure your backend to handle the following integrations:

#### SMS
- Provider options: Twilio, MessageBird, Vonage, etc.
- Required configuration: API key, sender ID
- Endpoint: `/api/messaging/sms/send`

#### WhatsApp
- Provider options: WhatsApp Business API, Twilio, MessageBird, etc.
- Required configuration: API key, business account ID
- Endpoint: `/api/messaging/whatsapp/send`

#### Viber
- Provider options: Viber Business API, MessageBird, etc.
- Required configuration: API key, service ID
- Endpoint: `/api/messaging/viber/send`

#### RCS
- Provider options: Google RCS Business Messaging, etc.
- Required configuration: API key, agent ID
- Endpoint: `/api/messaging/rcs/send`

### Voice Services

Configure your backend to handle the following voice service integrations:

#### Voice Calls
- Provider options: Twilio, Vonage, etc.
- Required configuration: API key, application ID
- Endpoint: `/api/voice/calls/make`

#### IVR
- Provider options: Twilio, Vonage, etc.
- Required configuration: API key, application ID
- Endpoint: `/api/voice/ivr/create`

### Chat Applications

Configure your backend to handle the following chat application integrations:

#### Live Chat
- Provider options: Custom implementation, third-party services
- Required configuration: API key, widget ID
- Endpoint: `/api/chat/live/session`

#### Chatbot
- Provider options: Custom implementation, third-party services
- Required configuration: API key, bot ID
- Endpoint: `/api/chat/bot/conversation`

## Data Models

Here are the expected data models for the API responses:

### Project
\`\`\`typescript
interface Project {
  id: string;
  name: string;
  description: string;
  type: 'marketing' | 'transactional' | 'customer-service' | 'alerts';
  campaigns: number;
  messages: string;
  engagement: number;
  updated: string;
  created_at: string;
  updated_at: string;
}
\`\`\`

### Campaign
\`\`\`typescript
interface Campaign {
  id: string;
  name: string;
  description: string;
  project_id: string;
  channel: 'sms' | 'whatsapp' | 'viber' | 'rcs' | 'voice';
  status: 'draft' | 'scheduled' | 'active' | 'completed';
  messages: string;
  engagement: number;
  scheduled_at: string | null;
  created_at: string;
  updated_at: string;
}
\`\`\`

### Template
\`\`\`typescript
interface Template {
  id: string;
  name: string;
  content: string;
  type: 'transactional' | 'marketing' | 'notification' | 'reminder';
  variables: string[];
  created_at: string;
  updated_at: string;
}
\`\`\`

### Contact
\`\`\`typescript
interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  attributes: Record<string, any>;
  created_at: string;
  updated_at: string;
}
\`\`\`

### Analytics
\`\`\`typescript
interface Analytics {
  messages: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  calls: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  deliveryRate: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
  contacts: {
    value: string;
    change: string;
    trend: 'up' | 'down';
  };
}
\`\`\`

## Development

### Code Structure

- `app/`: Next.js App Router pages and layouts
- `components/`: Reusable React components
- `lib/`: Utility functions and helpers
- `public/`: Static assets
- `styles/`: Global styles

### API Integration

To integrate with your backend API, update the API client in `lib/api.ts`:

\`\`\`typescript
// Example API client
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
\`\`\`

### Docker

\`\`\`bash
docker build -t sozuri-cpaas .
docker run -p 3000:3000 sozuri-cpaas
\`\`\`

## Recent Improvements & Best Practices

### Platform Enhancements

#### 1. Professional Overview Page
- Created an enterprise-grade landing page with industry-specific use cases
- Implemented a clean, modern design with proper navigation and call-to-action elements
- Added dedicated sections for key industries (Retail, Healthcare, Financial Services, Education)
- Included metrics, testimonials, and tailored recommendations for each industry

#### 2. Enhanced Onboarding Experience
- Developed a personalized welcome dashboard for returning users
- Created an industry-specific empty state component for new users
- Implemented a guided tour with step-by-step instructions
- Added progress tracking and personalized recommendations

#### 3. AI Suggestions System
- Built an intelligent recommendation engine that provides actionable insights
- Created a dedicated AI suggestions page with filtering and implementation tracking
- Implemented impact metrics to show potential improvements
- Added scheduled analysis and suggestion generation

#### 4. Improved Navigation and Hierarchy
- Enhanced the navigation structure for better usability
- Implemented breadcrumbs and contextual navigation
- Created a page hierarchy component for easy access to related sections
- Added clear visual indicators for the current location

### Frontend Architecture Updates
**1. React Query Integration**
```typescript
// Example usage in components
const { data, isLoading, error } = useQuery({
  queryKey: ['apiKeys'],
  queryFn: fetchApiKeys,
  staleTime: 60_000 // 1 minute cache
})

const mutation = useMutation({
  mutationFn: updateApiKey,
  onSuccess: () => queryClient.invalidateQueries(['apiKeys'])
})
```
- Added proper query invalidation patterns
- Implemented global error handling
- Created query client provider with optimized defaults

**2. Type Safety Enhancements**
```typescript
// Strongly typed API responses
interface ApiKey {
  id: string
  name: string
  key: string
  permissions: 'read' | 'write' | 'admin'
  active: boolean
  created: string
  expires?: string
}

// Typed query hooks
export function useApiKeys() {
  return useQuery<ApiKey[]>({
    queryKey: ['apiKeys'],
    queryFn: fetchApiKeys
  })
}
```
- Added TypeScript interfaces for all core entities
- Implemented type-safe API hooks
- Enabled strict null checks in tsconfig.json

**3. Logging System**
```typescript
// Centralized logging configuration
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: { colorize: true }
      },
      {
        target: 'pino/file',
        options: { destination: 'logs/combined.log' }
      }
    ]
  }
})

// API error logging
api.interceptors.response.use(null, (error) => {
  logger.error({
    message: 'API Error',
    url: error.config?.url,
    status: error.response?.status,
    error: error.response?.data
  })
  return Promise.reject(error)
})
```
- Implemented structured logging with Pino
- Added log rotation and retention policies
- Integrated logging with error boundaries

**4. Component Architecture**
```typescript
// Provider pattern implementation
export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        staleTime: 60_000
      }
    }
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  )
}
```
- Separated client/server components
- Created dedicated provider components
- Implemented atomic design pattern for UI components

### Updated Development Guidelines

#### 1. Code Quality & Structure
- Implemented React Error Boundary for robust error handling
- Added Suspense boundaries for client-side components
- Created unified error logging system
- Organized components using a feature-based structure
- Implemented strict TypeScript typing across the application

#### 2. Performance Best Practices
- Implemented request deduplication to reduce API calls
- Added request throttling for high-volume operations
- Created loading skeletons for all async components
- Optimized API cache strategies with React Query
- Implemented code splitting for improved load times
- Added proper handling of server-side vs. client-side code

#### 3. UI/UX Improvements
- Implemented a consistent design system with shadcn/ui
- Created responsive layouts for all screen sizes
- Added animations and transitions for a polished user experience
- Implemented dark mode support
- Enhanced accessibility with proper ARIA attributes and keyboard navigation

### Updated Environment Variables
```env
# React Query
NEXT_PUBLIC_QUERY_DEVTOOLS="false" # Enable in development
NEXT_PUBLIC_STALE_TIME="60000"

# Logging
LOG_LEVEL="debug"
LOG_ROTATION_INTERVAL="7d"
LOG_MAX_SIZE="100m"

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN="your-dsn-here"
```

### Updated Installation Steps
```bash
# New dependencies
npm install @tanstack/react-query @tanstack/react-query-devtools \
  pino pino-pretty @sentry/nextjs react-error-boundary
```

### Monitoring & Observability

#### 1. Health Checks & Diagnostics
```typescript
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
```
- Added health check endpoints for all services
- Implemented system diagnostics for troubleshooting
- Created a status dashboard for monitoring system health

#### 2. Analytics & Metrics
- Implemented comprehensive analytics tracking
- Added performance metrics for all key operations
- Created dashboards for monitoring user engagement
- Implemented real-time analytics for messaging performance

#### 3. AI-Powered Insights
- Integrated AI-powered analytics for pattern recognition
- Added predictive analytics for campaign performance
- Implemented anomaly detection for early issue identification
- Created personalized recommendations based on usage patterns

### Component Directory Structure

```
components/
├── analytics/           # Analytics components
├── campaigns/           # Campaign management components
├── contacts/            # Contact management components
├── layout/              # Layout components (header, sidebar, etc.)
├── messaging/           # Messaging components for different channels
├── metrics/             # Metrics and KPI components
├── navigation/          # Navigation components
├── onboarding/          # Onboarding and welcome components
├── providers/           # Context providers
├── ui/                  # UI components (buttons, cards, etc.)
└── voice/               # Voice service components
```

### Page Structure

```
app/
├── dashboard/           # Main dashboard
│   ├── ai-suggestions/  # AI suggestions page
│   ├── analytics/       # Analytics pages
│   ├── campaigns/       # Campaign management
│   ├── contacts/        # Contact management
│   ├── developers/      # Developer resources
│   ├── messaging/       # Messaging channels
│   ├── projects/        # Project management
│   ├── settings/        # User and account settings
│   ├── support/         # Support resources
│   └── voice/           # Voice services
├── onboarding/          # Onboarding flow
├── overview/            # Platform overview
└── auth/                # Authentication pages
```
