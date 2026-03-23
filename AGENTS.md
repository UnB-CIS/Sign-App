# AGENTS Instructions

This repository hosts a TypeScript/Next.js application inside the `questionpunk` directory. The notes below summarise the development workflow, list the most commonly used commands, and document the full checklist for introducing a new survey question type.

## Project Architecture

**Framework:** Next.js with App Router - This approach co-locates backend logic and routes with the frontend components.

**Database ORM:** Prisma for all database interactions.

**Database Management:**
- `prisma/schema.prisma` - Defines the database schema
- `prisma/migrations/` - Database migration files (generated and managed via Prisma CLI)
- `prisma/seed.ts` - Script to populate the database with initial data

## Contribution expectations

- Start work from a feature branch and open a pull request before merging.
- **CRITICAL: Always create PRs targeting `staging`, NEVER `main`.** The `main` branch only receives merges from `staging` after QA validation.
- Keep commits linted and formatted. Run `npm run format` before committing and `npm run lint` before opening a PR.

### Pull request base branch

```bash
# Correct - always use staging as base
gh pr create --base staging ...

# WRONG - never target main directly
gh pr create --base main ...
```

### Pull request workflow

- Keep each PR focused on a single feature or concern. Only bundle unrelated refactors (like styling or component rearrangement) when they are trivial and mechanical.
- Favour small, incremental PRs. Simpler logic reduces the surface area for regressions and makes reviews faster.
- Use the format `#1454: issue/QPUNK-890/cross-tabulation-function` and annotate blocked items with `blocked by 👉 #1452: ...`.

### Evolutionary PR Strategy

When building large features, **don't break a big PR into chunks**—instead, design a sequence of **complete, working solutions** that evolve toward the final goal.

**The Wrong Way (chunking):**
```
PR 1: Add infrastructure layer (doesn't work alone)
PR 2: Add schema changes (still doesn't work)
PR 3: Add backend logic (almost works)
PR 4: Add UI (finally works)
```
This is just one PR split into 4 pieces. Each PR is incomplete and hard to review because reviewers can't see the full picture.

**The Right Way (evolution):**
```
PR 1: "The Engine" - System works with new foundation, same behavior
PR 2: "Add Capabilities" - New functionality available programmatically
PR 3: "Expose to Users" - Full user-facing feature
```
Each PR is a **complete, shippable, testable solution**. You can stop at any point and have a working system.

**Principles:**

1. **Each PR delivers value** - Not "adds infrastructure" but "switches to new SDK with same behavior"
2. **Each PR is independently testable** - QA can verify it works without waiting for future PRs
3. **Each PR can be rolled back** - If PR 2 has issues, PR 1 still works
4. **Focus on one thing at a time** - Don't describe the transmission while building the engine

**Example: Multi-Model AI Support**

❌ **Wrong approach:**
- PR: "Add Vercel AI SDK infrastructure" (800 lines of plumbing, nothing works yet)
- PR: "Add model registry and schemas" (more plumbing)
- PR: "Wire up backend" (finally something works)
- PR: "Add UI" (feature complete)

✅ **Right approach:**
- **PR 1: Switch AI generation to Vercel AI SDK**
  - Goal: Replace OpenAI-specific code with SDK abstraction
  - Behavior: Identical to before (still uses GPT-4)
  - Value: Cleaner code, unified error handling, foundation ready
  - Test: AI interviews work exactly as before

- **PR 2: Add multi-model routing**
  - Goal: Backend accepts `modelId` and routes to correct provider
  - Behavior: API can use different models when specified
  - Value: Engineers can test models via API, A/B testing possible
  - Test: Call API with `modelId=anthropic/claude-3-5-sonnet`, get response from Claude

- **PR 3: Add model selector UI**
  - Goal: Users can choose AI model in survey builder
  - Behavior: Full user-facing model selection
  - Value: Complete feature shipped to users
  - Test: End-to-end user experience

**Key questions before opening a PR:**
- Does this PR work on its own?
- Can someone test this without reading future PRs?
- What value does this deliver if we stop here?
- Is the scope small enough to review in one sitting?

### Feature Documentation Structure

For complex features, use a **three-tier documentation hierarchy** to ensure clarity at all levels:

```
docs/
└── feature-name/
    ├── feature-name-implementation-plan.md   # Level 1: Full feature description
    ├── EVOLUTIONARY_PR_BREAKDOWN.md          # Level 2: PR breakdown with links
    └── evolutions/                           # Level 3: Detailed PR plans
        ├── evo-0-foundation.md
        ├── evo-1-core.md
        ├── evo-2-persistence.md
        └── ...
```

**Level 1: Implementation Plan** (`feature-name-implementation-plan.md`)
- Complete feature description and goals
- Desired end state with diagrams
- All phases and components
- Full technical specifications
- Success criteria

**Level 2: Evolutionary PR Breakdown** (`EVOLUTIONARY_PR_BREAKDOWN.md`)
- Summary of each evolutionary PR
- Dependency graph showing PR relationships
- Line estimates and what works after each PR
- Links to detailed plans
- Implementation order

**Level 3: Individual PR Plans** (`evolutions/evo-N-name.md`)
- Detailed implementation instructions
- Specific files to create/modify with code examples
- Schema changes and migrations
- API endpoints and payloads
- UI components and layouts
- Testing checklist
- Success criteria
- Rollback plan

**Example: Synthetic Users Feature**

```
docs/synthetic-users/
├── synthetic-users-implementation-plan.md    # 2000+ lines, full spec
├── EVOLUTIONARY_PR_BREAKDOWN.md              # Summary with 10 evolutions
└── evolutions/
    ├── evo-0-merge-engine.md                 # Prerequisite: merge existing work
    ├── evo-1-distinguish.md                  # ~80 lines: responseType + badge
    ├── evo-2-personas.md                     # ~120 lines: persona CRUD
    ├── evo-3-personas-ui.md                  # ~150 lines: /personas page
    ├── evo-4-test-tab.md                     # ~120 lines: survey editor tab
    ├── evo-5-filter.md                       # ~60 lines: response filtering
    ├── evo-6-think-aloud.md                  # ~100 lines: AI reasoning
    ├── evo-7-confidence.md                   # ~90 lines: confidence scores
    ├── evo-8-templates.md                    # ~70 lines: persona templates
    └── evo-9-ai-generate.md                  # ~100 lines: AI persona creation
```

**Benefits of this structure:**

1. **Progressive detail**: High-level overview → breakdown → implementation details
2. **Standalone PRs**: Each evo-N file contains everything needed to implement that PR
3. **Clear dependencies**: Breakdown shows what must come before/after
4. **Reviewable scope**: Each PR plan is focused and digestible
5. **Onboarding**: New developers can understand the full feature or dive into specifics

**When to use this structure:**

- Features with 3+ evolutionary PRs
- Complex features spanning multiple domains (schema, API, UI)
- Features where multiple developers may work on different evolutions
- Features requiring clear handoff documentation

### PR Review Guidelines

When reviewing pull requests, apply the following criteria to ensure code quality, consistency, and maintainability. These guidelines are derived from analyzing 293+ PRs reviewed by talibasya.

#### Code Organization & File Structure

**File Extensions:**
- React hooks must use `.ts` extension, not `.tsx`
- Only use `.tsx` if the hook returns JSX
- If a hook needs JSX, consider it a design issue that should be refactored

**Folder Structure:**
- Providers belong in the `context` folder, not `hooks`
- Follow established conventions: hooks in `/hooks`, contexts/providers in `/context`, constants in `/app/constants`
- See **[Code Organization & File Size Guidelines](#code-organization--file-size-guidelines)** for detailed file size limits

**Following Patterns:**
- Always follow existing patterns in the codebase
- Reference similar implementations before creating new approaches
- Common pattern references: `useDataLoader.ts`, `generateAiSurveyQuestion.ts`, `create-draft` pattern
- See **[API Route Handler Pattern](#api-route-handler-pattern)** for backend routes
- See **[Frontend Architecture](#frontend-architecture)** for component patterns

#### Type Safety & DRY Principles

- Avoid copy-pasting type definitions across files
- Define types in one place (preferably in an interface)
- Extract reusable logic into utilities or hooks
- Use Zod schemas for validation (see **[Validation and Schema Organization](#validation-and-schema-organization)**)

#### Performance & Database Optimization

- Use single database queries instead of multiple queries where possible
- Avoid over-engineering solutions (e.g., streaming when sending the whole file is sufficient)
- Check for N+1 query problems
- Use Prisma efficiently

#### Naming Conventions

- Boolean variables should sound like booleans, not functions
  - ✅ `isPublishDisabled`
  - ❌ `isPublishDisabledForStudy` (when it's a variable, not a function)
- Function names should be verb-based and action-oriented
- Place constants in established constant files (e.g., `/app/constants/plans.ts`)

#### React & TypeScript Conventions

- Avoid vanilla JS code style in React components
- Use React-based conventions consistently
- Use `useDataLoader` pattern for promise wrapping: "rewrite to use promise wrap"
- Follow established error handling patterns: "the error is shown by the different function. See how promise requests are handled inside the app."
- See **[Data Fetching & Mutation Patterns](#data-fetching--mutation-patterns)** for detailed usage

#### Key Review Principles

1. **Consistency Over Innovation:** Follow existing patterns in the codebase
2. **Simplicity Over Complexity:** Avoid over-engineering solutions
3. **Type Safety First:** Define types once, use everywhere
4. **Proper Organization:** Files and folders should follow established conventions
5. **Performance Matters:** Optimize database queries, avoid unnecessary complexity
6. **Atomic Changes:** Keep PRs focused and small
7. **Reusability:** Extract and reuse common patterns (see **[Component Architecture Best Practices](#component-architecture-best-practices)**)
8. **Convention Adherence:** React, TypeScript, and project-specific conventions must be followed

## Frequently used scripts

| Purpose                   | Command                    |
| ------------------------- | -------------------------- |
| Install dependencies      | `npm install`              |
| Start the dev server      | `npm run dev`              |
| Start Docker database     | `npm run docker:up`        |
| Stop Docker database      | `npm run docker:down`      |
| Run database migrations   | `npm run migrate:dev`      |
| Seed the database         | `npm run seed`             |
| Format code               | `npm run format`           |
| Run ESLint                | `npm run lint`             |
| Execute unit tests        | `npm test`                 |
| Build production bundle   | `npm run build`            |

> **Tip:** Always run commands from the `questionpunk` directory unless otherwise noted.

### Formatting

- Run `npm run format` (Prettier) after making changes so diffs stay consistent and CI passes.
- Prefer formatting early and often—run it before linting, testing, or committing.

## Running the project locally

Follow these steps to set up the local development environment:

1. **Navigate to project directory:** `cd questionpunk`
2. **Start the database:** `npm run docker:up` (runs `docker compose -f docker-compose.local.yaml up -d`)
3. **Install dependencies:** `npm install`
4. **Run database migrations:** `npm run migrate:dev` (runs `prisma migrate dev`)
5. **Seed the database:** `npm run seed` (runs `tsx prisma/seed.ts`)
6. **Launch the dev server:** `npm run dev`

> **Note:** Steps 2-5 only need to be run once for initial setup, or when the database schema changes.

## Database workflow (Prisma)

- After editing the Prisma schema, apply the changes locally with `npx prisma migrate dev`.
- Use `npx prisma migrate deploy` during production deployments.
- Reset the local database with `npx prisma migrate reset` if you need a clean slate.

### Managing Multiple Database States

When working on multiple branches simultaneously, you can maintain separate database states using Docker volumes and environment variables:

**How it works:**
1. The `.env` file contains a `DB_DATA` variable (e.g., `DB_DATA=qpunk-staging`) that defines the Docker volume name
2. The `docker-compose.local.yml` file reads this variable to mount the appropriate volume
3. Docker Desktop's "Volumes" tab shows all persistent volumes

**Workflow to switch between database states:**

1. **Clone your current volume** in Docker Desktop (e.g., clone `qpunk-staging` to `qpunk-staging-1`)
2. **Update `.env`** to point to the new volume: `DB_DATA=qpunk-staging-1`
3. **Restart Docker:**
   ```bash
   npm run docker:down
   npm run docker:up
   ```

This allows you to work on schema changes or test data on a new branch without affecting your main database state. Switch back anytime by changing the `.env` variable and restarting Docker.

## Quality gates before merging

1. `npm run format`
2. `npm run lint`
3. `npm run build`
4. `npm run seed` _(verify data seeding still succeeds)_
5. `npm test`

## Code Organization & File Size Guidelines

Maintain a clean, scannable codebase by adhering to these file size guidelines:

**General Files:** Target maximum of **300-400 lines**
- Files exceeding this threshold become harder to understand and maintain
- Consider breaking large files into logical sub-modules

**API Route Handlers:** Target maximum of **150 lines**
- Route handlers should remain focused on a single responsibility
- Extract complex logic into separate utility functions or service files

**Large Helper Files:**
- Some utility files (e.g., `surveyQuestionMethods.ts`) currently exceed 800 lines
- These "god files" are candidates for refactoring into smaller, specialized files
- Use comments to create logical sections within files until refactoring is complete

**Refactoring Strategy:**
- Group related functions together
- Split into smaller, more focused files
- Maintain clear separation of concerns

## API Error Handling

The project uses a two-tiered error handling strategy within API handlers, managed by the `asyncWrapper`:

### 1. Client-Facing Errors (ClientError)

Use when you want to send a specific, safe, and user-readable error message to the frontend.

**Usage:**
```typescript
import { ClientError } from "@/app/api/v1/common";

if (survey.prompts.length > 0) {
  throw new ClientError('The survey given was generated earlier');
}
```

**Behavior:**
- The `asyncWrapper` catches `ClientError` instances
- The error message is passed directly to the client in the JSON response
- The frontend can display this message to the user

### 2. Internal Server Errors (Standard Error)

Use for unexpected exceptions or errors that should not be exposed to users.

**Usage:**
```typescript
throw new Error('Database connection failed');
// Or let unexpected errors happen naturally
```

**Behavior:**
- The `asyncWrapper` catches all non-ClientError exceptions
- Full error details are sent to the error aggregation service for debugging
- A generic message like "Server Internal Error" is sent to the client
- This prevents leaking sensitive information (database details, stack traces) to the frontend

**Security Note:** Never expose internal error details (database errors, file paths, stack traces) to the client. Always use `ClientError` for user-facing messages.

## API Route Handler Pattern

When creating API routes in `app/api/v1/`, follow the standard pattern used throughout the codebase for consistency and maintainability.

### Standard Pattern

**✅ DO** - Separate handler from wrapper:

```typescript
// app/api/v1/example/route.ts
import "server-only";
import { NextRequest, NextResponse } from "next/server";
import {
  asyncWrapper,
  successResponse,
  shouldBeAuthorized,
} from "@/app/api/v1/common";
import { getPrismaClient } from "@/app/utilities/prisma";

// // // // // //
// GET handler - Retrieve examples
// // // // // //

async function getHandler(request: NextRequest) {
  const session = await shouldBeAuthorized();
  const prisma = getPrismaClient();

  // ... handler logic ...

  return NextResponse.json(
    successResponse({
      data: results,
    }),
  );
}

// // // // // //
// POST handler - Create new example
// // // // // //

async function postHandler(request: NextRequest) {
  const session = await shouldBeAuthorized();
  const prisma = getPrismaClient();

  // ... handler logic ...

  return NextResponse.json(
    successResponse({
      created: result,
    }),
  );
}

export const GET = asyncWrapper(getHandler);
export const POST = asyncWrapper(postHandler);
```

**❌ DON'T** - Inline handlers with complex type signatures:

```typescript
// Avoid this pattern - it's harder to read and inconsistent with the codebase
export const GET = asyncWrapper<
  Promise<ReturnType<typeof successResponse<{ data: SomeType[] }>>>
>(async (request: NextRequest) => {
  // 50+ lines of handler logic inline
});
```

### Pattern Benefits

- **Readability**: Handler logic is visually separated from the wrapper
- **Consistency**: Matches 90% of existing API routes
- **Maintainability**: Easier to refactor, test, and add middleware
- **Type Safety**: TypeScript infers return types automatically from your handler
- **Scannability**: Clean exports at the bottom make it easy to see available methods

### For Dynamic Routes

When using dynamic route parameters, include the `RouteContext` type:

```typescript
type RouteContext = {
  params: {
    id: string;
  };
};

async function getHandler(request: NextRequest, context: RouteContext) {
  const id = context.params.id;
  // ... handler logic ...
}

export const GET = asyncWrapper(getHandler);
```

### Section Comments

Use section comments to clearly separate different HTTP methods:

```typescript
// // // // // //
// GET handler - Brief description of what it does
// // // // // //
```

This matches the style used in other parts of the codebase (e.g., `chat/reply/route.ts`).

### Validation and Schema Organization

**Request Body Validation:**

✅ **DO** - Use `parseRequestJson` helper with separate schema file:

```typescript
// z_schema.ts
import { z } from "zod";

export const body_schema = z.object({
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(280),
  // ... more fields
});

// route.ts
import { parseRequestJson } from "@/app/api/v1/common";
import { body_schema } from "./z_schema";

async function postHandler(request: NextRequest) {
  const parsedBody = await parseRequestJson(request, body_schema);
  // ... handler logic
}
```

❌ **DON'T** - Manually parse with try/catch:

```typescript
// Avoid this - inconsistent with 100+ other routes
let parsedBody: z.infer<typeof bodySchema>;
try {
  parsedBody = bodySchema.parse(await request.json());
} catch (error: any) {
  throw new ClientError(`Invalid payload: ${error.message}`);
}
```

**Why use this pattern:**

- **Consistency**: Used in 100+ routes across the codebase
- **Cleaner**: One line instead of 5-6 lines of boilerplate
- **Better error handling**: `parseRequestJson` properly handles ZodError
- **Separation of concerns**: Schemas in separate files are easier to find and maintain
- **Reusability**: Schemas can be imported by tests or other routes

**Schema file naming:** Always use `z_schema.ts` in the same directory as your route.

### Zod Schema Best Practices

When writing Zod schemas, follow these security and validation best practices:

#### 1. Always use `.strict()` on objects

Reject unknown keys to prevent payload pollution:

```typescript
// ✅ DO - reject unknown keys
const userSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
  })
  .strict()
  .optional();

// ❌ DON'T - allows any extra keys to pass through
const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
}).optional();
```

#### 2. Always use `zStringDefaultMax` for strings

Use the centralized string validator for consistent length limits:

```typescript
import { zStringDefaultMax } from '@/app/utilities/validate/z_common';

// ✅ DO - uses platform-wide length limit
name: zStringDefaultMax.trim().min(1),

// ❌ DON'T - no length limit, vulnerable to oversized payloads
name: z.string().trim().min(1),
```

#### 3. Add `.max()` limits to arrays

Prevent oversized array payloads:

```typescript
// ✅ DO - limits array size
tags: z.array(zStringDefaultMax.trim()).max(20).optional(),

// ❌ DON'T - unbounded array
tags: z.array(zStringDefaultMax.trim()).optional(),
```

#### 4. Use `zStringDefaultMax` for record keys AND values

In Zod 4, `z.record()` requires a key schema:

```typescript
// ✅ DO - validates both keys and values
attitudes: z.record(zStringDefaultMax, zStringDefaultMax.trim()).optional(),

// ❌ DON'T - unbounded key length
attitudes: z.record(z.string(), zStringDefaultMax.trim()).optional(),
```

#### 5. Limit record key count with `.refine()`

Prevent excessive keys in record objects:

```typescript
const MAX_RECORD_KEYS = 20;

// ✅ DO - limits number of keys
attitudes: z
  .record(zStringDefaultMax, zStringDefaultMax.trim())
  .refine((record) => Object.keys(record).length <= MAX_RECORD_KEYS, {
    message: `attitudes can have at most ${MAX_RECORD_KEYS} keys`,
  })
  .optional(),
```

#### 6. Extract shared schemas to avoid duplication

When multiple routes use the same nested schema, extract it to a shared file:

```typescript
// ✅ DO - shared schema file
// z_persona_details_schema.ts
export const personaDetailsSchema = z.object({...}).strict().optional();

// create/z_schema.ts
import { personaDetailsSchema } from '../z_persona_details_schema';
export const body_schema = z.object({
  name: zStringDefaultMax.trim().min(1),
  personaDetails: personaDetailsSchema,
});

// update/z_schema.ts
import { personaDetailsSchema } from '../z_persona_details_schema';
export const body_schema = z.object({
  id: z.uuid(),
  personaDetails: personaDetailsSchema,
});

// ❌ DON'T - duplicate schema definitions in each route file
```

### Payload handling after validation

- `parseRequestJson` returns an object that already passed Zod validation, but calling code must still be explicit about what it forwards to other helpers or services. Always destructure the exact fields you expect (`const { surveyId, text } = parsedBody;`) and pass those forward instead of spreading the entire `parsedBody`. This prevents unnoticed extra properties from slipping through follow-up logic such as `generateTitleDescription` and removes opportunities for accidental backdoors.
- Be deliberate with string validation. Prefer `z.string().trim().min(1, "...message...")` (or other appropriate constraints) over bare `z.string()`. Endpoints should state their expectations for length, casing, and formatting so that downstream logic never has to guess at requirements. When you just need the canonical length guard, use helpers in `app/utilities/validate/z_common.ts` such as `zStringDefaultMax` so we stay consistent with platform-wide limits.

## Frontend Architecture

### Folder Structure

The frontend code is organized within the `app` directory using Next.js route groups:

**`app/(main)/`** - Primary route group for the authenticated application
- Contains all pages accessible to logged-in users
- Main working directory for feature development

**`app/(marketing)/`** - Deprecated, no longer in use

**`app/(main)/components/`** - All React client components
- `components/pages/` - Components representing full pages or major sections
- `components/ui/` - Reusable UI components (buttons, inputs, etc.)
- `components/popup/` - Modal and popup components

### Design Philosophy

The project follows two core design principles for frontend code:

#### 1. Declarative vs. Imperative Code

**Preferred: Declarative** - Write code that describes *what* should happen, not *how*
- More readable and easier to understand
- Not strictly enforced, but highly encouraged
- Acceptable to use imperative code when it's clearer

**Example of Declarative approach:**
```typescript
// Declarative - describes what to render
{isLoggedIn && <Dashboard />}
{hasError && <ErrorMessage error={error} />}

// vs. Imperative - describes how to do it
if (isLoggedIn) {
  renderDashboard();
}
if (hasError) {
  showErrorMessage(error);
}
```

#### 2. State Management - "Dumb Components" Pattern

**Core Principle:** Centralize logic and state in container components, keep child components stateless.

- **Container Components (Smart):** Manage state, logic, and side effects
- **Presentational Components (Dumb):** Receive all data via props, remain stateless
- Child components should avoid creating their own internal state
- Pass data and callbacks down through props

**Benefits:**
- Predictable data flow
- Easier testing
- Better reusability
- Clearer separation of concerns

### Custom Hooks for Logic & State

All complex frontend logic, state management, and side effects are encapsulated in custom React hooks located in `app/(main)/hooks/`.

**Predefined patterns available:**
- Showing spinners during loading
- Displaying popups or modals
- Making API requests
- Handling client-side errors

**Developer Guidance:** Before creating new logic, review existing hooks in this directory to find and reuse established patterns.

### Data Fetching & Mutation Patterns

#### 1. Data Fetching (GET requests)

**Hook:** `useDataLoader`

**Purpose:** Standard pattern for fetching data on the client side, typically used within `useEffect`.

**Usage:**
```typescript
const { data, loading, error } = useDataLoader(
  () => api.survey.getById(surveyId)
);
```

#### 2. Data Mutation (POST/PUT/DELETE requests)

**Pattern:** `useWrapPromise` hook with `.run()` method

**Purpose:** Standard for executing user-triggered actions (create, update, delete).

**Usage:**
```typescript
// In a custom hook (e.g., useSurveyForm.ts)
import { useWrapPromise } from '@/app/hooks/useWrapRequest';

const wrapPromise = useWrapPromise();

// Execute a mutation
wrapPromise.run({
  onCall: () => api.survey.updateProps(props),
  onThen: ({ response }) => {
    // Handle success
  },
});
```

**Built-in Functionality:**
- Automatically shows spinner when request starts
- Catches and handles errors
- Supports custom error handling via `onCatch` callback
- Supports custom spinner payload via `spinnerPayload`

**Example with callbacks:**
```typescript
wrapPromise.run({
  onCall: () => api.syntheticPersona.create(data),
  onThen: ({ response }) => {
    setPersonas((prev) => [...prev, response]);
  },
  onCatch: (error) => {
    toast.error('Failed to create persona');
    console.error(error);
  },
});
```

### Client-Side API Layer

**Location:** `app/utilities/client-api/`

**Purpose:** Contains client-side functions that make fetch requests to the backend.

**Usage:** These functions are passed into custom hooks like `useDataLoader` or used with `useWrapPromise`.

**Example:**
```typescript
// app/utilities/client-api/survey.ts
export const api = {
  survey: {
    prolific: {
      createDraftStudy: (data) => fetch('/api/v1/survey/prolific', {
        method: 'POST',
        body: JSON.stringify(data)
      })
    }
  }
};

// In component/hook
const { run } = createWrapPromise(api.survey.prolific.createDraftStudy);
```

### Refactoring Anti-Patterns

When reviewing or refactoring frontend code, watch for these patterns that should be updated:

#### ❌ Manual try...catch with loading state

```typescript
// Don't do this
const [loading, setLoading] = useState(false);
try {
  setLoading(true);
  const result = await api.survey.getData();
  setLoading(false);
} catch (error) {
  setLoading(false);
  handleError(error);
}
```

**✅ Use wrapPromise instead:**
```typescript
const { run } = createWrapPromise(api.survey.getData);
// Automatically handles loading state and errors
```

#### ❌ Conditional logic inside hooks

```typescript
// Don't do this
function useData() {
  if (rowQuestionId && colQuestionId) {
    const data = useDataLoader(() => api.getData(rowQuestionId, colQuestionId));
  }
}
```

**✅ Move conditions to parent component:**
```typescript
// In parent component
{rowQuestionId && colQuestionId && <DataComponent />}

// In hook - always call unconditionally
function useData() {
  const data = useDataLoader(() => api.getData(rowQuestionId, colQuestionId));
}
```

This makes the data flow explicit and keeps hooks transparent and readable.

## Component Architecture Best Practices

### Keep Components Focused and Maintainable

Large monolithic components become difficult to understand, test, and maintain. Follow these guidelines:

**Size Guidelines:**

- **Target:** Keep components under 300-400 lines
- **Warning zone:** 400-600 lines - consider refactoring opportunities
- **Action required:** 600+ lines - actively plan component extraction

**When to Extract:**

Extract a component into smaller pieces when you notice:

- **Multiple responsibilities** - component handles distinct concerns (e.g., form UI + data management + validation)
- **Repeated patterns** - similar JSX blocks appear multiple times
- **Deep nesting** - more than 3-4 levels of nested conditionals or components
- **Difficult testing** - hard to write focused unit tests
- **Poor readability** - team members struggle to understand the code flow

**Extraction Strategy:**

✅ **DO** - Extract by responsibility:

```typescript
// Before: 1500-line monolithic component
<AIInterviewEdit />

// After: Focused, composable components
<AIInterviewEdit>
  <PersonalityModal />       // ~300 lines - personality CRUD
  <ContextMessagesSection /> // ~250 lines - message management
  <CustomPersonalityManager />  // ~130 lines - list management
</AIInterviewEdit>
```

**Benefits of Extraction:**

- **Readability:** Each file has a single, clear purpose
- **Testability:** Smaller components are easier to test in isolation
- **Reusability:** Extracted components can often be reused elsewhere
- **Maintainability:** Easier to modify without affecting unrelated code
- **Performance:** Smaller components can be more easily memoized

**Naming Convention:**

- Place extracted components in a subdirectory named after the parent component
- Example: `SurveyForm/SurveyItem/FormDetails/AIInterviewEdit/PersonalityModal.tsx`
- This keeps related code together and makes the relationship clear

**Related Files:**

- Keep TypeScript interfaces and types in the same file or nearby (`types.ts`)
- Keep constants specific to the component in the same directory
- Share utilities across components via a `utils.ts` file in a common parent directory

## UX Design Principles

When designing or improving UI components, refer to the comprehensive **[UX Guidelines](UX_GUIDELINES.md)** document.

Key principles include:

- Progressive Disclosure (show complexity gradually)
- Visibility of System Status (clear indicators)
- Recognition over Recall (show don't tell)
- Aesthetic & Minimalist Design (clean interfaces)

The UX Guidelines document includes the full 7 principles, pattern evaluation framework, common UI patterns (accordion, tabs, modals, etc.), case studies, and anti-patterns to avoid.

## Survey Editing & Data Queuing Pattern

The application uses a specialized "black box" pattern to manage all survey edits, ensuring data integrity and preventing data loss from concurrent requests or users closing the application.

### Core Concepts

**Update Queue:** All survey modifications are not sent to the backend immediately. Instead, they're added to an internal queue.

**Sequential Processing:** The system processes the queue one item at a time, sending each update sequentially.

**Client-Side Lock:** While the queue is being processed, the system locks the client (via `useOnBeforeUnload.ts`) to prevent the user from closing the tab until all changes are saved.

### Developer Workflow

This complex logic is abstracted away from component developers:

1. **Use Predefined Hooks:** Use hooks like `useSurveyDetails.ts` or `useSurvey.ts` to manage survey state
2. **Return Modified Data:** Your function only needs to return the modified field or data object
3. **Black Box Handles Everything Else:** The hook automatically adds the change to the queue; the background system handles locking, sequential API calls, and error handling

**Example:**
```typescript
// In your component
const { updateSurveyTitle } = useSurveyDetails();

// Just return the new data - the queue handles the rest
const handleTitleChange = (newTitle: string) => {
  updateSurveyTitle(newTitle);
  // Queue system automatically:
  // - Adds to queue
  // - Locks the browser tab
  // - Sends request sequentially
  // - Unlocks when complete
};
```

**Benefits:**
- Prevents data loss from accidental tab closures
- Prevents race conditions from concurrent updates
- Automatic retry and error handling
- Developers don't need to manage complex async state

## Background Jobs (Trigger.dev)

The project uses **Trigger.dev** to manage resource-intensive and asynchronous tasks that shouldn't block the main request/response cycle.

### When to Use Trigger.dev

Use for endpoints that require:
- Heavy AI processing (survey generation, analysis)
- Long-running operations (>30 seconds)
- Tasks that can run asynchronously

### Location

**All job code:** `app/(main)/trigger/`

**Primary job file:** `generate.ts` - Handles AI survey generation

### Local Development

To test Trigger.dev functionality locally:

1. Run the main application: `npm run dev`
2. **Simultaneously** run the local Trigger.dev connection: `npm run trigger:dev`

Both services must run concurrently for background jobs to work in development.

### Future Scope

More endpoints and jobs will be added to the `trigger/` directory as the platform expands AI and async processing features.

## Development Tools

### Playground Folder for Experimental Scripts

The project includes a workflow for running standalone TypeScript scripts that can import and use functions from the main application.

**Why this exists:** Some application modules use the `"server-only"` directive, which causes errors if imported by standard TypeScript runners like `tsx`. The playground workflow solves this.

**Location:** `app/(main)/playground/`

**Git Status:** This folder is in `.gitignore` and won't be committed to the repository

**Purpose:** Create temporary, experimental scripts for testing or debugging

### Usage Workflow

1. **Create your script** in the `playground/` folder (e.g., `prolific.ts`)
2. **Import application functions** (like `getPrismaClient`) to test them
3. **Generate the CLI config:**
   ```bash
   npm run generate_cli_tsconfig
   ```
   This creates a special `tsconfig.cli.js` file configured for CLI execution
4. **Run your script:**
   ```bash
   npx tsx --tsconfig tsconfig.cli.js app/(main)/playground/your-script.ts
   ```

**Example:**
```typescript
// app/(main)/playground/test-survey.ts
import { getPrismaClient } from '@/app/utilities/prisma';

async function testSurvey() {
  const prisma = getPrismaClient();
  const surveys = await prisma.survey.findMany({ take: 5 });
  console.log(surveys);
}

testSurvey();
```

Then run:
```bash
npm run generate_cli_tsconfig
npx tsx --tsconfig tsconfig.cli.js app/(main)/playground/test-survey.ts
```

## Creating a new question type

Adding a question type touches many parts of the codebase. The checklist below mirrors what was required for the "Constant Sum" implementation.

### 1. Define core types and interfaces

- Add the new question type string (for example, `'constant_sum'`) to the `AnswerType` union in `app/interfaces/Survey/SurveyItem/base.ts`.
- Create a dedicated interface file (e.g. `app/interfaces/Survey/SurveyItem/constant_sum.ts`) that exports:
  - `YourQuestionTypeItemDetails` extending `BaseItemDetails` with settings such as `total_value`, `min_value`, `max_value`, and `allow_decimals`.
  - `YourQuestionTypeTextFieldsItemDetails` extending `BaseSurveyItemTextFieldItemDetails` for translatable text fields like `answer_options`.
  - `PreCreateYourQuestionTypeSurveyItem`, `YourQuestionTypeSurveyItem`, and `ClientYourQuestionTypeSurveyItem` interfaces extending the generic survey item shapes.

### 2. Integrate with grouped survey item types

- Import your `PreCreateYourQuestionTypeSurveyItem` in `app/interfaces/Survey/SurveyItem/grouped.ts`.
- Add it to the `PreCreateSurveyItem` union so builders and API layers recognise it.

### 3. Implement creation utilities

- Create `createYourQuestionTypeSurveyItem.ts` in `app/utilities/survey/createSurveyItem/`.
  - Initialise default values, merge `withItem` and `fallBackItem` data, and handle optional fields safely.
- Register the creation function in `app/utilities/survey/createSurveyItem/index.ts`:
  - Extend both the `createBaseSurveyItem` and `createEmptyTextFields` switch statements.
  - Provide defaults through `createDefaultItemDetails`.

### 4. Extend API schemas and validation (Zod)

- Define `ItemDetails` and `TextFieldsItemDetails` schemas in `app/api/v1/survey_question/zod_schemas/survey_items.ts` and `.../text_fields.ts`.
- Add the schemas to the `body_schema_item_create` and `body_schema_item_update` unions.
- Ensure client payloads (e.g. in `useQuestionSettingMethods.ts`) match the Zod expectations—`textFields` should be a single object for the initial create flow.

### 5. Build UI components and hooks

- **Respondent view:** create a component such as `app/components/pages/Chat/Question/ConstantSumQuestion.tsx` that renders the question, validates inputs, and uses `useTranslation` for messaging.
- **Builder view:** add an edit component (e.g. `.../FormDetails/ConstantSumEdit.tsx`) that lets creators configure the question. Pair it with a hook like `useYourQuestionTypeMethods.ts` modelled on `useMultipleChoiceMethods.ts`.
- **Wire-up:**
  - Register the edit component in `app/components/pages/SurveyEdit/BuildTab/SurveyForm/SurveyItem/FormDetails/index.tsx`.
  - Provide an icon via `app/icons/redesigned/question-types/` and update `SurveyItemsIcon.tsx`.
  - Supply a label in `SurveyItemLabel.tsx`.
  - Update the preview switch in `PreviewLogicBlock.tsx` so the builder preview works.

### 6. Internationalisation (i18n)

- Add every user-facing string to `app/locales/[lang]/common.json` for all supported locales (`en`, `fr`, `es`, `de`, `it`, `uk`).
- Include translations for settings, instructions, validation messages, and UI labels.
- Ensure all components use the `useTranslation()` hook and `t()` helper.

### 7. System integration and popups

- Add the question type to `categorisedSurveyItems` in `app/components/Popup/CreateSurveyItemPopup/index.tsx` so it appears in the "Add Question" modal.
- Confirm `app/components/Popup/SurveyEditCreateItem.tsx` references the correct source of truth (`categorisedSurveyItems` vs. `itemTypes`).

### 8. Prompts and AI features

**All AI prompts MUST be centralized in `app/prompts/`.** Never inline prompt strings in API routes or components.

```
app/prompts/
├── aiLedInterviewerTransition/   # AI-led interview mode prompts
├── constants.ts                   # Shared prompt constants
├── fill/                          # Question fill/completion prompts
├── followup/                      # Follow-up question generation
├── generalRetry.ts               # Generic retry prompts
├── imageGeneration/              # Image generation prompts
├── parseAgentSurvey/             # Survey parsing prompts
├── prolific/                     # Prolific integration prompts
├── surveyInterview/              # Survey interview prompts
├── surveyQuestion/               # Survey question generation
├── surveyRules/                  # Survey rule prompts
└── syntheticResponse/            # Synthetic persona response prompts
```

**Prompt file organization:**
- Each feature gets its own subdirectory (e.g., `syntheticResponse/`)
- Use `system.ts` for system prompts and `user.ts` for user prompts
- Export functions that build prompts with proper interpolation
- Keep prompts under 200 lines per file; split into system/user if larger

**When adding new prompts:**
- Create a new directory under `app/prompts/` for the feature
- Follow the system.ts/user.ts naming convention
- Use TypeScript template literals for variable interpolation
- Document expected variables in function parameters

**For new question types specifically:**
- Update `app/prompts/surveyQuestion/surveyItem/common.ts` with the new type in both `answerTypes` (include a short description) and `generateAnswerTypes`.
- Add parsing logic to `app/utilities/survey/parseStreamedSurvey.ts` so AI-generated survey items populate correctly.

### 9. Shared validation and utilities

- Update:
  - `app/utilities/survey/chat/processAnswer.ts` if answer processing differs from existing types.
  - `app/prompts/surveyQuestion/prefilledSurveyQuestionUser/isValidSurveyItemTextDetails.ts` for text-field validation.
  - `app/utilities/survey/isInvalidSurveyItem.ts` to recognise empty states.
  - `app/components/Popup/CreateSurveyItemPopup/AISuggestionsTab/SuggestionItem.tsx` for validation and tooltip content.

### 10. Survey time estimation

- Add an entry to `questionTimeMap` in `app/utilities/survey/chat/calculateSurveyTime.ts` with a realistic completion-time estimate (e.g. complex allocation questions often take ~45 seconds).

### 11. Reporting and analytics

- Update `QuestionTypeReportDetails` in `app/components/pages/SurveyEdit/Report/QuestionTypeReports/index.tsx`.
- Create a specific report component if needed (for example, `.../YourQuestionTypeReport.tsx`).
- Extend `app/utilities/client-api/survey_report.ts` with the new TypeScript definitions.

### 12. Type safety and error handling

- Guard optional properties (such as `max_value`) with sensible defaults or type refinements.
- Ensure branching logic in `.../BranchingLogic/ConditionList.tsx` can express the new question's rules.
- Update `app/utilities/survey/validateSurveyItem.ts` with any bespoke validation.

### 13. Prisma schema updates

- Add the answer type to the `AnswerType` enum in `prisma/schema.prisma`.
- Generate and apply a migration: `npx prisma migrate dev --name add_<your_question_type>`.

### 14. Testing and quality assurance

- Run the formatting, linting, build, and unit-test commands listed above.
- Manually verify:
  - Building, editing, and previewing the question in the form builder.
  - Completing a survey that includes the new question.
  - Viewing analytics and reports for collected responses.
  - Switching between all supported translations.
- Perform spot checks across major browsers and viewports.

### 15. Additional considerations

- **Performance:** watch out for expensive validation triggered on every keystroke.
- **Accessibility:** ensure proper ARIA attributes, keyboard navigation, and focus management.
- **Mobile support:** test on small screens to confirm inputs and layouts respond correctly.
- **Data export:** confirm the new answer type appears correctly in any export/CSV logic.

### Common pitfalls

- Forgetting translation keys for non-English locales.
- Missing updates in utility functions like survey-time estimation or validation helpers.
- Allowing optional properties to cause runtime errors.
- Skipping accessibility audits.
- Neglecting boundary cases such as empty arrays, invalid numeric input, or minimum/maximum enforcement.

Refer to the "Constant Sum" feature commits for concrete examples of the full integration path.

## Survey Item Data Storage Patterns

### Translatable vs Non-Translatable Data

Survey items have two data storage locations with distinct purposes:

| Location | Purpose | Examples |
|----------|---------|----------|
| `itemDetails` | Non-translatable settings/config | `scale`, `shape`, `min_value`, `max_value`, `randomize_options` |
| `textFields.itemDetails` | Translatable text (per-language) | Labels, option text, placeholder text |

**Critical Rule:** Translatable text (anything users see) must ONLY be stored in `textFields.itemDetails`, never in base `itemDetails`.

### Pattern Reference: OpinionScale

OpinionScale is the canonical example of correct data separation:

```typescript
// itemDetails (base) - non-translatable numbers
interface OpinionScaleItemDetails {
  min_value: number;  // e.g., 0
  max_value: number;  // e.g., 10
}

// textFields.itemDetails - translatable strings
interface OpinionScaleTextFieldsItemDetails {
  min_value_label: string;   // e.g., "Not at all likely"
  medium_value_label: string; // e.g., "Neutral"
  max_value_label: string;    // e.g., "Extremely likely"
}
```

### Implementation Checklist

When creating or modifying a question type:

1. **Methods Hook (`use*Methods.ts`):**
   - Use `onChangeWrapper` for non-translatable settings (updates `itemDetails`)
   - Use `onChangeTextFieldsWrapper` for translatable text (updates `textFields.itemDetails`)

   ```typescript
   // ✅ Correct - scale is non-translatable
   const onSetScale = onChangeWrapper((value, state) => {
     state.itemDetails.scale = value;
     return state;
   });

   // ✅ Correct - labels are translatable
   const onSetLabels = onChangeTextFieldsWrapper((labels, textFieldsState) => {
     textFieldsState.itemDetails.labels = labels;
     return textFieldsState;
   });
   ```

2. **Create Function (`create*SurveyItem.ts`):**
   - Only set non-translatable data in `itemDetails`
   - Set translatable data in `textFields.itemDetails`

   ```typescript
   // ✅ Correct
   newSurveyItem.itemDetails.scale = 5;  // Non-translatable

   // ❌ Wrong - don't set translatable data in base itemDetails
   newSurveyItem.itemDetails.labels = ['Bad', 'Good'];

   // ✅ Correct - translatable data in textFields
   emptyFields.itemDetails.labels = labels;
   ```

3. **Edit Component (`*Edit.tsx`):**
   - Include translation source display for translators:

   ```typescript
   const { getSourceForTranslation } = useCommonSurveyItemMethods();
   const sourceTextFields = getSourceForTranslation(lang, surveyItem.clientId);

   // Show source text above inputs when translating
   {sourceTextFields && (
     <div className="text-sm text-gray-500 bg-gray-150 rounded-sm py-1 px-3">
       {sourceTextFields.itemDetails.labelText}
     </div>
   )}
   ```

4. **Display Component (`*Question.tsx`):**
   - Read from `textFields.itemDetails` first
   - Fall back to `itemDetails` only for backward compatibility with old data

   ```typescript
   const { labels: translatedLabels } = textFields.itemDetails;
   const { labels: baseLabels } = itemDetails;
   const displayLabels = translatedLabels || baseLabels || null;
   ```

5. **Zod Schema:**
   - Keep deprecated fields in schema for backward compatibility (reading old data)
   - Add comments marking deprecated fields

### Backward Compatibility Pattern

When deprecating a field location:

1. **Keep the old field** in interfaces and schemas for reading existing data
2. **Don't set the old field** when creating/editing new data
3. **Add fallback display logic** to handle both old and new data
4. **Document the migration** with comments in the interface file

Example from Rating question:

```typescript
/**
 * Rating Question Labels - Backward Compatibility Guide
 *
 * STORAGE PATTERN (follows OpinionScale pattern):
 *   - Non-translatable settings → itemDetails (scale, shape, labelPosition)
 *   - Translatable text → textFields.itemDetails ONLY (labels[])
 *
 * DISPLAY PRIORITY (in RatingQuestion.tsx):
 *   1. If textFields.itemDetails.labels[] exists → show per-value labels
 *   2. Else if itemDetails.labels[] exists → fallback for old data
 *   3. Else if min_label/max_label exists → show legacy labels
 *   4. Else → show no labels
 */
```

### Common Mistakes to Avoid

1. **Storing translatable text in `itemDetails`** - This breaks translations
2. **Using `onChangeWrapper` for text fields** - This doesn't update per-language data
3. **Forgetting translation source display** - Translators need to see the original text
4. **Removing deprecated fields** - This breaks existing surveys
