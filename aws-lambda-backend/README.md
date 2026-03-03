# AWS Lambda Backend

This backend is a serverless API for the expense tracker app, built with AWS Lambda, API Gateway, DynamoDB, and TypeScript.

## Features

- Signup and login endpoints (`/api/auth/signup`, `/api/auth/login`)
- User data stored in DynamoDB

## Setup

1. Install dependencies from the monorepo root:
   ```bash
   pnpm install
   ```
2. Copy the example environment file:
   ```bash
   cp aws-lambda-backend/.env.example aws-lambda-backend/.env
   # Edit aws-lambda-backend/.env and fill in required values
   ```
3. Build the project:
   ```bash
   pnpm --filter aws-lambda-backend run build
   ```
4. Start the API locally:
   ```bash
   pnpm --filter aws-lambda-backend start
   ```

## Environment Variables

- `USERS_TABLE`: DynamoDB table for users (default: `Users`)

## Deployment

Deploy using AWS SAM CLI:

```bash
sam deploy --guided
```

---

This package is part of the monorepo. See the root README for more details.
