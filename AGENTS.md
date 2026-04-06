<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## 🧩 Tech Stack

- Next.js (App Router)
- TypeScript
- Axios (API layer)
- React Query (server state)
- React Hook Form
- Zod
- UI: shadcn/ui
- Backend: Java REST API

---

## 📂 Architecture

src/
app/ # routes (App Router)
components/ # shared UI
services/ # API layer (Axios)
hooks/ # custom hooks
lib/ # utilities
types/ # types

---

## 🔁 Data Flow (STRICT)

UI (shadcn)
→ React Hook Form
→ Zod validation
→ React Query (query/mutation)
→ Axios (services)
→ Backend

❌ DO NOT break this flow

---

## 📡 API Rules

- ALL API calls must go through services/\*
- Use ONE Axios instance only
- Use interceptors for:
  - JWT token
  - error handling

❌ DO NOT:

- use fetch()
- call API inside components

---

## 📦 React Query Rules

- useQuery → GET
- useMutation → POST/PUT/DELETE
- DO NOT use useEffect for fetching

---

## 🧾 Form Rules

- ALWAYS use React Hook Form
- ALWAYS validate using Zod
- Use zodResolver

---

## 🧱 UI Rules

- Use shadcn/ui components only
- Do NOT create duplicate UI components

---

## 🚫 Forbidden

- No direct API call inside components
- No inline validation (must use Zod)
- No duplicated business logic
- Do NOT guess API response

---

## 📚 Additional Context (READ FIRST)

- @docs/ARCHITECTURE.md
- @docs/API_CONTRACT.md
- @docs/VALIDATION.md
- @docs/STATE_MANAGEMENT.md

---

## ⚠️ Source of Truth Priority

1. API_CONTRACT.md → API shape
2. Zod schemas → validation
3. services/\* → API calls

If missing → ASK, DO NOT GUESS
