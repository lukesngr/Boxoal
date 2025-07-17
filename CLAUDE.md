# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev          # Start development server on http://localhost:3000

# Testing
npm test            # Run tests in watch mode
npm run test -- --coverage  # Run tests with coverage

# Building & Production
npm run build       # Create production build
npm run start       # Start production server

# Code Quality
npm run lint        # Run ESLint

# Database
npx prisma migrate dev    # Run migrations in development
npx prisma generate       # Generate Prisma client
npx prisma studio         # Open Prisma Studio GUI
```

## Architecture Overview

This is a **Next.js 13 (Pages Router)** timeboxing application with the following stack:

### Frontend
- **Framework**: Next.js with Pages Router (not App Router)
- **State Management**: Redux Toolkit for client state + React Query for server state
- **UI**: Material-UI v5 + Bootstrap 5.3 + custom SCSS
- **Authentication**: Dual system - AWS Cognito (primary) and NextAuth with GitHub

### Backend
- **API Routes**: All endpoints in `/pages/api/` following REST patterns
- **Database**: PostgreSQL with Prisma ORM
- **Error Tracking**: Sentry integration

### Key Architectural Patterns

1. **API Route Pattern**: All API routes follow this structure:
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {  // or GET, etc.
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    // Prisma operations here
    res.status(200).json({ result });
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await prisma.$disconnect();
  }
}
```

2. **Component Organization**:
   - `/components/base/` - Shared components
   - `/components/form/` - Form components
   - `/components/[feature]/` - Feature-specific components (goal, timebox, schedule)
   - `/hooks/` - Custom React hooks
   - `/modules/` - Business logic and utilities

3. **State Management**:
   - Redux slices in `/redux/` for UI state (modals, selections, etc.)
   - React Query for server data fetching
   - Local component state for form inputs

4. **Authentication Flow**:
   - AWS Cognito configured in `/modules/awsConfig.js`
   - NextAuth configured in `/pages/api/auth/[...nextauth].js`
   - No middleware protection - auth checked in components

## Database Schema

Key models in Prisma schema:
- **Schedule**: User's timeboxing schedule container
- **TimeBox**: Individual time blocks with start/end times
- **RecordedTimeBox**: Actual recorded time for tracking
- **Goal**: Goals with progress tracking and metrics
- **Profile**: User preferences (box size, wake time)

## Important Considerations

1. **No TypeScript**: Project uses JavaScript despite TypeScript being installed
2. **Mixed Authentication**: Both AWS Cognito and NextAuth are used - be aware of which is primary
3. **API Security**: API routes currently lack authentication middleware
4. **Environment Variables Required**:
   - `DATABASE_URL`, `DB_DIRECT_URL`, `SHADOW_DATABASE_URL`
   - `GITHUB_ID`, `GITHUB_SECRET`
   - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`

5. **Testing**: Only unit tests exist for utility functions. No component or integration tests.
6. **Styling**: Uses SCSS modules, Material-UI, and Bootstrap - maintain consistency

## Common Development Tasks

### Adding a New API Endpoint
1. Create file in `/pages/api/`
2. Follow the standard handler pattern above
3. Use Prisma client from `/modules/prismaClient.js`
4. Include Sentry error handling

### Adding a New Component
1. Check existing components for patterns
2. Use Material-UI components where possible
3. Connect to Redux if needed for global state
4. Use React Query for data fetching

### Working with Database
1. Update schema in `/prisma/schema.prisma`
2. Run `npx prisma migrate dev --name your_migration_name`
3. Prisma client auto-generates after migration

### State Management Decision Tree
- **UI State** (modals, selections): Use Redux
- **Server Data**: Use React Query
- **Form State**: Use local component state
- **User Authentication**: Check AWS Cognito via Amplify