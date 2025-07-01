# Cloud Resource Pricing Calculator

## Overview

This is a full-stack cloud resource pricing calculator application that allows users to calculate costs for CPU, RAM, and disk storage resources. The application provides real-time pricing calculations and can email configuration summaries to Gmail addresses.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Email Service**: Nodemailer with Gmail integration
- **Session Storage**: In-memory storage (can be extended to PostgreSQL)

### UI Components
- **Component Library**: Radix UI primitives with shadcn/ui styling
- **Design System**: Consistent theming with CSS custom properties
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

## Key Components

### Data Models
- **Configuration Schema**: Defines CPU, RAM, disk, email, and total cost fields
- **Validation**: Zod schemas for runtime type checking and form validation
- **Database Schema**: Drizzle schema with PostgreSQL table definitions

### API Endpoints
- `POST /api/send-configuration`: Creates configuration and sends email summary

### Pricing Logic
- CPU: $15.00 per core per month
- RAM: $2.50 per GB per month  
- Disk: $0.10 per GB per month
- Automatic calculation of monthly and annual costs

### Email Integration
- Gmail SMTP configuration
- HTML email templates with pricing breakdowns
- Configuration summary delivery

## Data Flow

1. **User Input**: Users configure CPU, RAM, and disk resources through form inputs
2. **Real-time Calculation**: Pricing updates automatically as users adjust resources
3. **Validation**: Client-side validation ensures valid Gmail addresses and resource limits
4. **API Request**: Form submission sends configuration to backend API
5. **Data Storage**: Configuration stored in database with calculated total cost
6. **Email Delivery**: HTML email sent to user's Gmail with pricing breakdown
7. **User Feedback**: Toast notifications confirm successful operations

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database queries and schema management
- **nodemailer**: Email delivery service
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **zod**: Runtime type validation

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production builds
- **drizzle-kit**: Database schema migration tool

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds optimized React application
2. **Backend Build**: esbuild bundles Express server with external dependencies
3. **Output Structure**: Frontend assets in `dist/public`, server bundle in `dist/`

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **GMAIL_USER/EMAIL_USER**: Gmail account for sending emails
- **GMAIL_PASS/EMAIL_PASS**: Gmail app password or authentication

### Production Deployment
- **Start Command**: `npm start` runs production server
- **Port Configuration**: Server listens on configurable port
- **Static File Serving**: Express serves built frontend assets

## Changelog

```
Changelog:
- July 01, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```