# Expense Tracker

Monorepo for the Expense Tracker app: AWS Lambda backend (API + auth) and React frontend.

## Prerequisites

- **Node.js** v18+ (`node -v`)
- **pnpm** v8+ — `npm install -g pnpm`
- **AWS CLI** — for deployment ([install](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html))
- **Serverless Framework** — installed via `pnpm run setup:aws` (or `pnpm add -g serverless`)

## Repository structure

| Package               | Description                                               |
| --------------------- | --------------------------------------------------------- |
| `aws-lambda-backend/` | API (Node.js, TypeScript, Serverless, DynamoDB), JWT auth |
| `frontend/`           | React app (Vite, TypeScript, MUI)                         |

[pnpm workspaces](https://pnpm.io/workspaces) — root install and scripts from repo root.

---

## Quick start

```bash
git clone <repo-url>
cd expense-tracker

pnpm install
pnpm run setup:aws    # optional: AWS CLI + Serverless + env setup
pnpm run genenv       # copy .env.example → .env where missing
# Edit aws-lambda-backend/.env and frontend/.env as needed

pnpm run build
pnpm run dev          # backend (serverless offline) + frontend (Vite)
```

---

## Setup (detailed)

1. **Clone and install**

   ```bash
   git clone <repo-url>
   cd expense-tracker
   pnpm install
   ```

2. **Environment files**

   ```bash
   pnpm run genenv
   ```

   - Creates `aws-lambda-backend/.env` and frontend env files from `.env.example` if missing.
   - Edit `aws-lambda-backend/.env` and `frontend/.env` (or `.env.development` / `.env.production`) with your values. See the `.env.example` files for required variables.

3. **AWS setup (for deploy or serverless offline)**

   ```bash
   pnpm run setup:aws
   ```

   - Ensures `.env` files exist
   - Installs AWS CLI if missing (Linux x64)
   - Installs Serverless globally
   - Runs `scripts/aws-env-setup.ts` to configure AWS credentials from `.env`

4. **Build and run**

   ```bash
   pnpm run build
   pnpm run dev
   ```

   Or run backend and frontend separately: `pnpm run dev:backend`, `pnpm run dev:frontend`.

---

## Environment variables

| Location                                                    | Purpose                                                |
| ----------------------------------------------------------- | ------------------------------------------------------ |
| `aws-lambda-backend/.env`                                   | API keys, DynamoDB table names, JWT secret, AWS region |
| `frontend/.env` (or `.env.development` / `.env.production`) | `VITE_API_URL` and any other Vite env vars             |

See `aws-lambda-backend/.env.example` and `frontend/.env.example` for full lists and descriptions. The app will warn if required variables are missing.

---

## Deploy

### Backend (AWS Lambda)

Configuration: `aws-lambda-backend/serverless.yml`. No SAM/template.yml needed.

```bash
pnpm run deploy:backend
```

Local API emulation (API Gateway + Lambda):

```bash
pnpm run dev:backend
# or: pnpm --filter aws-lambda-backend exec serverless offline
```

### Frontend

Build, then deploy `frontend/dist` to your static host (e.g. S3, Vercel, Netlify).

```bash
pnpm run build:frontend
pnpm run deploy:frontend   # example: syncs to S3 bucket expense-tracker-2026
```

Deploy backend and frontend in one go:

```bash
pnpm run deploy:all
```

---

## Scripts (root)

| Script                     | Description                                          |
| -------------------------- | ---------------------------------------------------- |
| `pnpm run genenv`          | Copy `.env.example` → `.env` in backend and frontend |
| `pnpm run setup:aws`       | AWS CLI + Serverless + credential setup from `.env`  |
| `pnpm run build`           | Build backend and frontend                           |
| `pnpm run dev`             | Run backend (serverless offline) and frontend (Vite) |
| `pnpm run dev:backend`     | Backend only (serverless offline)                    |
| `pnpm run dev:frontend`    | Frontend only (Vite dev server)                      |
| `pnpm run deploy:backend`  | Deploy Lambda/API (Serverless)                       |
| `pnpm run deploy:frontend` | Deploy frontend (e.g. S3 sync)                       |
| `pnpm run deploy:all`      | Deploy backend then frontend                         |
| `pnpm run typecheck`       | TypeScript check (backend + frontend)                |
| `pnpm run lint`            | ESLint (backend + frontend)                          |
| `pnpm run test`            | Jest (backend) + Vitest (frontend)                   |
| `pnpm run format`          | Prettier format                                      |
| `pnpm run ci`              | Build backend, typecheck frontend, lint both         |

Run a script in one workspace: `pnpm --filter aws-lambda-backend <script>` or `pnpm --filter frontend <script>`.

---

## Troubleshooting

- **Node / pnpm version** — Use Node 18+ and pnpm 8+ (see `.nvmrc` if you use nvm).
- **Missing env vars** — Ensure `aws-lambda-backend/.env` and `frontend/.env` (or `.env.development`) exist and required variables are set; see `.env.example` files.
- **AWS deploy** — Verify AWS credentials and region; run `aws sts get-caller-identity` to confirm.
- **Frontend API errors** — Ensure backend is running and `VITE_API_URL` in frontend env points to it (e.g. `http://localhost:3000/dev` for serverless offline).

---

## Monorepo notes

- Root managed with **pnpm** and `pnpm-workspace.yaml`.
- Each package has its own dependencies and scripts; run from root with `pnpm --filter <package> <command>`.
- For shared code, consider a `packages/shared` workspace and the `workspace:*` protocol.

More detail: `aws-lambda-backend/README.md`, `frontend/README.md`.
