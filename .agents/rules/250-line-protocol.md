# 250-Line Limit Protocol

This protocol enforces strict file length limits across the entire codebase to maintain high readability, maintainability, modularity, and adherence to the Single Responsibility Principle (SRP).

---

## 1. Core Rule

- **Strict File Limit:** No source file (`.ts`, `.tsx`, `.js`, `.mjs`, `.css`, etc.) may exceed **250 lines**.
- **Scope:** Applies to all application code and custom scripts in `apps/api`, `apps/web`, `scripts`, and the repository root.
- **Exemptions:** Auto-generated files, package lockfiles (`pnpm-lock.yaml`), build output directories (`dist/`, `.next/`), and third-party dependencies (`node_modules/`).

---

## 2. Refactoring Protocol (Splitting Pattern)

When any file exceeds or approaches 250 lines, it **must** be decomposed according to the following mandatory pattern:

### A. Dedicated Folder Creation
1. Create a new directory named after the file being split (e.g., if `crypto.ts` exceeds 250 lines, create a directory named `crypto/`).
2. Replace or convert the original file location to this directory.

### B. Sub-File Granularity (< 250 Lines Each)
1. Split the logic into smaller, cohesive modules within the newly created directory:
   - Specific route handlers / sub-components / hooks / utilities / types / constants.
2. **Every individual sub-file inside this directory must also strictly stay below 250 lines.**

### C. Barrel Export via `index.ts`
1. Create an `index.ts` (or `index.tsx` / `index.css`) file inside the folder.
2. Re-export all necessary functions, classes, components, and types through `index.ts`.
3. **Public API Guarantee:** External consumers import directly from the folder path without breaking changes or knowledge of internal file splits:
   ```typescript
   // Consumers continue to import cleanly:
   import { registerCryptoRoutes } from './routes/crypto';
   ```

---

## 3. Structural Example

### Before (File exceeds 250 lines):
```text
src/
└── components/
    └── user-profile.tsx  (e.g., 320 lines) ❌ VIOLATION
```

### After (Compliant decomposition):
```text
src/
└── components/
    └── user-profile/                 (Directory named after original file)
        ├── user-profile-header.tsx   (< 250 lines)
        ├── user-profile-avatar.tsx   (< 250 lines)
        ├── user-profile-details.tsx  (< 250 lines)
        ├── types.ts                  (< 250 lines)
        └── index.ts                  (Re-exports public API, < 250 lines) ✅ COMPLIANT
```

#### Inside `index.ts`:
```typescript
export { UserProfile } from './user-profile';
export type { UserProfileProps } from './types';
```

---

## 4. Enforcement & Automated Checks

1. **ESLint (`max-lines` rule):**
   Configured in `eslint.config.mjs` with strict mode (`max: 250, skipBlankLines: false, skipComments: false`). Lint checks will fail if any TypeScript or JavaScript file exceeds 250 lines.

2. **Automated Line Protocol Script:**
   The repository script `scripts/check-line-protocol.mjs` verifies all code files (including CSS and other non-ESLint assets).
   ```bash
   pnpm check:lines
   ```

3. **CI / Commit Gate:**
   `pnpm lint` executes `check-line-protocol.mjs` followed by `eslint .` before builds and tests can pass.
