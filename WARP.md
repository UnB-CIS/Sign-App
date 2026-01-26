# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Structure

This is a monorepo where the main Next.js application lives inside the `questionpunk/` subdirectory. **Always run commands from `/questionpunk` unless otherwise specified.**

```
questionpunk/                    # Root directory
├── AGENTS.md                    # Comprehensive development guide
├── UX_GUIDELINES.md            # UX design principles
├── questionpunk/               # Main Next.js application (WORK HERE)
│   ├── app/                    # Next.js App Router
│   │   ├── (main)/            # Primary authenticated app route group
│   │   │   ├── components/    # All React client components
│   │   │   │   ├── pages/    # Full page components
│   │   │   │   ├── ui/       # Reusable UI components
│   │   │   │   └── popup/    # Modal components
│   │   │   ├── hooks/        # Custom React hooks (logic & state)
│   │   │   └── playground/   # Experimental scripts (gitignored)
│   │   ├── api/v1/           # API routes
│   │   ├── utilities/        # Shared utilities
│   │   │   ├── client-api/   # Client-side API fetch functions
│   │   │   └── prisma.ts     # Prisma client singleton
│   │   ├── interfaces/       # TypeScript interfaces
│   │   ├── prompts/          # AI prompt templates
│   │   └── trigger/          # Trigger.dev background jobs
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── migrations/       # Database migrations
│   │   └── seed.ts           # Database seeding script
│   └── package.json          # Project dependencies
```

## Essential Commands

**Always run these from the `questionpunk/` directory:**

### Development
```bash
cd questionpunk                          # Navigate to project directory first
npm install                              # Install dependencies
npm run docker:up                        # Start local PostgreSQL database
npm run migrate:dev                      # Run database migrations
npm run seed                             # Seed database with test data
npm run dev                              # Start dev server (localhost:3000)
```

### Trigger.dev (Background Jobs)
```bash
npm run trigger:dev                      # Run alongside npm run dev for AI generation features
```

### Quality Checks (Run Before Committing)
```bash
npm run format                           # Format with Prettier (run first)
npm run lint                             # Run ESLint
npm run build                            # Build production bundle
npm test                                 # Run Jest tests
```

### Database Management
```bash
npx prisma migrate dev                   # Create and apply new migration
npx prisma migrate deploy                # Deploy migrations (production)
npx prisma migrate reset                 # Reset database (destructive)
npx prisma studio                        # Open Prisma Studio GUI
```

### Testing
```bash
npm test                                 # Run all tests
npm test -- path/to/test.spec.ts        # Run single test file
```

### Running Experimental Scripts
```bash
npm run generate_cli_tsconfig            # Generate CLI TypeScript config
npx tsx --tsconfig tsconfig.cli.js app/(main)/playground/your-script.ts
```

## Architecture Overview

### Framework & Core Technologies
- **Next.js 15** with App Router (co-locates backend routes with frontend)
- **Prisma ORM** for all database interactions
- **PostgreSQL** with vector search and fuzzy matching extensions
- **Next-Auth** for authentication
- **Trigger.dev** for long-running async tasks (AI generation)
- **TypeScript** throughout

### Frontend Architecture Principles

**State Management Pattern: "Dumb Components"**
- Container components manage state, logic, and side effects
- Presentational components receive data via props and remain stateless
- Centralize complex logic in custom hooks (`app/(main)/hooks/`)

**Data Fetching & Mutations:**
```typescript
// Fetching data (GET requests)
const { data, loading, error } = useDataLoader(
  () => api.survey.getById(surveyId)
);

// Mutations (POST/PUT/DELETE)
const { run } = createWrapPromise(api.survey.update);
await run(surveyData);  // Automatically handles loading state and errors
```

**Design Philosophy:**
- Prefer declarative over imperative code
- Keep components under 300-400 lines
- Extract responsibilities into focused sub-components
- Follow the 7 UX principles documented in `UX_GUIDELINES.md`

### Backend Architecture Patterns

**API Route Handler Pattern:**
```typescript
// app/api/v1/example/route.ts
import { asyncWrapper, successResponse, shouldBeAuthorized } from "@/app/api/v1/common";
import { parseRequestJson } from "@/app/api/v1/common";
import { body_schema } from "./z_schema";

async function getHandler(request: NextRequest) {
  const session = await shouldBeAuthorized();
  const prisma = getPrismaClient();
  // ... handler logic ...
  return NextResponse.json(successResponse({ data: results }));
}

export const GET = asyncWrapper(getHandler);
```

**Error Handling:**
- `throw new ClientError('message')` - User-facing error messages
- `throw new Error('message')` - Internal errors (never exposed to client)
- All handlers wrapped with `asyncWrapper` for consistent error handling

**Validation:**
- Always use `parseRequestJson(request, schema)` for request validation
- Define Zod schemas in separate `z_schema.ts` files
- Consistent pattern used across 100+ routes

### Survey Data Queuing System

The app uses a specialized "black box" pattern to manage survey edits:

**Purpose:** Prevent data loss from concurrent requests or users closing the browser

**How it works:**
- All survey edits are queued (not sent immediately)
- Queue processes sequentially, one update at a time
- Browser tab is locked (via `useOnBeforeUnload.ts`) until all changes are saved

**Usage in components:**
```typescript
const { updateSurveyTitle } = useSurveyDetails();
updateSurveyTitle(newTitle);  // Automatically queued and saved
```

Developers don't manage the queue directly - predefined hooks handle everything.

## Git Workflow

1. Create feature branches: `feature/QPUNK-916/description-of-ticket`
2. **Never push directly to `main`**
3. Merge into `staging` first
4. Validate staging build
5. Promote `staging` → `main`

## Development Best Practices

### File Size Guidelines
- **General files:** Target max 300-400 lines
- **API route handlers:** Target max 150 lines
- **Components:** Extract when > 400-600 lines or multiple responsibilities
- Files > 800 lines are candidates for refactoring

### Code Organization
- Place extracted components in subdirectories named after parent
- Keep related TypeScript types in same file or nearby `types.ts`
- Share utilities via `utils.ts` in common parent directory

### Testing Before Merge
Run this checklist in order:
1. `npm run format`
2. `npm run lint`
3. `npm run build`
4. `npm run seed` (verify seeding still works)
5. `npm test`

### Managing Multiple Database States

When working on multiple branches with different schemas:

1. Clone Docker volume in Docker Desktop (e.g., `qpunk-staging` → `qpunk-staging-1`)
2. Update `.env`: `DB_DATA=qpunk-staging-1`
3. Restart Docker:
   ```bash
   npm run docker:down
   npm run docker:up
   ```

Switch back anytime by changing `.env` and restarting Docker.

## Adding a New Survey Question Type

This is a complex multi-step process. See full checklist in `AGENTS.md` under "Creating a new question type" (15-step process).

**Key files to update:**
1. Type definitions: `app/interfaces/Survey/SurveyItem/`
2. Creation utilities: `app/utilities/survey/createSurveyItem/`
3. API validation: `app/api/v1/survey_question/zod_schemas/`
4. UI components: `app/components/pages/Chat/Question/` and `BuildTab/SurveyForm/SurveyItem/FormDetails/`
5. Icons: `app/icons/redesigned/question-types/`
6. Translations: `app/locales/[lang]/common.json`
7. AI prompts: `app/prompts/surveyQuestion/surveyItem/common.ts`
8. Prisma schema: Add to `AnswerType` enum
9. Reporting: `app/components/pages/SurveyEdit/Report/QuestionTypeReports/`

## Trigger.dev Background Jobs

**Location:** `app/(main)/trigger/`

**When to use:** Heavy AI processing, long-running operations (>30 seconds), async tasks

**Local development requires both:**
```bash
npm run dev           # Terminal 1
npm run trigger:dev   # Terminal 2
```

**Deployment:**
```bash
npx trigger.dev@latest deploy --env staging
npx trigger.dev@latest deploy  # production
```

## Playground Scripts (Experimental)

The `app/(main)/playground/` folder (gitignored) is for experimental scripts that need to import `"server-only"` modules.

**Workflow:**
1. Create script in `playground/` (e.g., `test-survey.ts`)
2. Import application functions like `getPrismaClient`
3. Generate CLI config: `npm run generate_cli_tsconfig`
4. Run: `npx tsx --tsconfig tsconfig.cli.js app/(main)/playground/test-survey.ts`

## Environment Setup

Create `.env` file from `.env.example` template.

**Key variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `DB_DATA` - Docker volume name for database state
- `TRIGGER_DEV_PROJECT_ID` - Trigger.dev project ID
- `TRIGGER_SECRET_KEY` - Get from Trigger.dev dashboard (development environment)
- `ADD_GOOGLE_ADS_TAG` - Enable marketing conversion tracking

## Common Gotchas

1. **Commands must run from `questionpunk/` directory** - not the repo root
2. **Trigger.dev won't work** unless both `npm run dev` AND `npm run trigger:dev` are running
3. **Server-only imports fail in scripts** - use playground workflow instead
4. **Never commit unless lint and build pass** - staging/production will fail
5. **Format before linting** - Prettier changes can cause lint errors
6. **Database migrations** - Always run `npx prisma migrate dev` after schema changes
7. **Survey edits use a queue** - Don't implement manual save logic, use provided hooks

## Project Management

- Linear board: https://www.linear.app/questionpunk1
- Feature branches include ticket number: `feature/QPUNK-XXX/description`
- Test code locally before pushing - if it doesn't build, it won't work on server

## Additional Documentation

- `AGENTS.md` - Comprehensive 800+ line development guide with detailed patterns
- `UX_GUIDELINES.md` - 7 core UX principles and pattern evaluation framework
- `questionpunk/README.md` - Test environment and survey generation system details
