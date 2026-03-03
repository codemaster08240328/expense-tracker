# Prerequisites

- Node.js v18+ (recommended: check with `node -v`)
- pnpm v8+ (install with `npm i -g pnpm`)
- AWS CLI (for backend deployment)
- Serverless Framework or AWS SAM CLI (for backend deployment)

---

# aws-lambda Monorepo

This repository is now structured as a monorepo using [pnpm workspaces](https://pnpm.io/workspaces).

## Structure

- `aws-lambda-backend/` — AWS Lambda backend (Node.js, TypeScript, Serverless)
- `frontend/` — Frontend application (React, Vite, TypeScript)

## Getting Started

## Setup Instructions

1. **Clone the repository**

   ```sh
   git clone <repo-url>
   cd <repo-name>
   ```

2. **Install dependencies and set up AWS environment**

   ```sh
   pnpm install
   pnpm run setup:aws
   ```

   This will:

   - Generate `.env` files from `.env.example` if missing
   - Install AWS CLI (if not already installed)
   - Install Serverless Framework globally
   - Configure AWS CLI credentials from your `.env` file

3. **Edit environment variables**

   - Open `aws-lambda-backend/.env` and `frontend/.env` and fill in the required values (see comments in each file for descriptions).

4. **Build all packages**

   ```sh
   pnpm run build
   ```

5. **Run in development mode**
   ```sh
   pnpm run dev
   ```

---

## Environment Variables

- See `backend/.env.example` and `frontend/.env.example` for all required variables and descriptions.
- Place `.env` files in the respective package directories (`backend/.env`, `frontend/.env`).
- The app will fail gracefully with helpful messages if required variables are missing.

---

## How to Deploy

### Backend (AWS Lambda)

Using Serverless Framework for all local and cloud development:

**Deploy to AWS:**

```sh
pnpm run deploy:backend
```

**Emulate locally (API Gateway, Lambda):**

```sh
pnpm --filter aws-lambda-backend exec serverless offline
```

No template.yml or AWS SAM required. All configuration is in `aws-lambda-backend/serverless.yml`.

### Frontend

After building, deploy the contents of `frontend/dist` to your static hosting (S3, Vercel, Netlify, etc).

---

## Troubleshooting

- Ensure you are using the correct Node.js and pnpm versions.
- If you see missing environment variable errors, check your `.env` files and ensure all required variables are set.
- For AWS deployment issues, verify your AWS credentials and CLI configuration.
- For frontend API errors, check that the backend is running and the `VITE_API_URL` is set correctly in `frontend/.env`.

---

## Monorepo Tooling

- Managed with `pnpm` and `pnpm-workspace.yaml`
- Each package manages its own scripts and dependencies

## Best Practices

- Keep shared code in a separate package if needed (e.g., `packages/shared`)
- Use workspace protocol for cross-package dependencies
- Run scripts from the root with `pnpm --filter <package> <command>`

---

For more details, see individual package READMEs.
