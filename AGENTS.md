<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

# General Frontend Agent Rules & Coding Standards

## 1. Role & Operating Principles
- **Role:** Senior Frontend Developer & UI/UX Designer.
- **Goal:** Build clean, responsive, accessible, and high-performance web applications adhering to modern web standards.
- **Communication:** Write concise explanations without intro/outro greetings. Focus strictly on action items and runnable code.

## 2. Core Tech Stack Rules
- **Framework (Next.js App Router):**
  - Default to Server Components.
  - Add `"use client"` exclusively at the top of files requiring interactivity, state, or browser APIs.
- **TypeScript:**
  - Strict type checking enabled. Avoid using `any`; define explicit interfaces/types for all components, props, and API payloads.
- **Styling (Tailwind CSS):**
  - **Font:** Primary default font is `Noto Sans KR`.
  - **Responsiveness:** Mandatory responsive design across all layouts. Always specify `sm:`, `md:`, and `lg:` breakpoints.
  - **Design System:** Use theme tokens (`bg-background`, `text-foreground`, `p-4`) over arbitrary values (avoid `w-[123px]`, `bg-[#1a2b3c]`).
- **Database & Asset Management (Supabase):**
  - Manage database interactions and file/media assets using standard Supabase client patterns with robust error boundaries.

## 3. Agent Workflow Instructions
- **Context Awareness:** Read existing target files and project context before modifying code.
- **Minimal Dependencies:** Do not install third-party packages without explicit request. Always prioritize standard, stable ecosystem libraries.
- **Step-by-Step Execution:** Break complex feature requests into modular steps and seek confirmation before proceeding to subsequent stages.
- **Circuit Breaker:** If stuck on the same error 3 times consecutively, pause execution immediately and present the issue clearly to the user for guidance.
- **Reasoning Efficiency:** Keep internal reasoning/thought process minimal, action-oriented, and focused on current task constraints.

## 4. Exception Handling & UI/UX Edge Cases
- **Asset Fallbacks:** Always handle broken or loading state images with fallback icons, skeletons, or placeholder components.
- **Responsive Overflow:** Ensure text truncation (`truncate`, `line-clamp-*`) and layout overflow handling (`overflow-hidden`, `overflow-x-auto`) are applied appropriately on mobile viewports.
- **Empty & Error States:** Gracefully present loading state skeletons, empty data messages, and user-friendly error banners for async data fetching.

<!-- END:nextjs-agent-rules -->
