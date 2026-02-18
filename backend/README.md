# seniorproject-backend

This folder contains a NestJS backend scaffold and an industry-style folder structure to build upon.

Quick start

```bash
cd backend
npm install
npm run start:dev
```

Structure highlights
- `src/modules` — feature modules (users, auth, products, etc.)
- `src/common` — pipes, filters, interceptors, guards
- `src/config` — configuration & env handling
- `src/shared` — cross-cutting services (logger, mail, etc.)

Next steps: customize `src/modules` and add DB + auth integrations.
