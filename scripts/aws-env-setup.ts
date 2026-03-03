// This script reads AWS credentials from .env and configures the AWS CLI
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

const envPath = path.resolve(__dirname, '../aws-lambda-backend/.env');
if (!fs.existsSync(envPath)) {
  console.error(
    'No .env file found in aws-lambda-backend. Please create it first.',
  );
  process.exit(1);
}

dotenv.config({ path: envPath });

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;

if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION) {
  console.error(
    'Missing AWS credentials or region in .env. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION.',
  );
  process.exit(1);
}

try {
  execSync(`aws configure set aws_access_key_id ${AWS_ACCESS_KEY_ID}`);
  execSync(`aws configure set aws_secret_access_key ${AWS_SECRET_ACCESS_KEY}`);
  execSync(`aws configure set region ${AWS_REGION}`);
  console.log('AWS CLI configured successfully from .env');
} catch (err) {
  console.error('Failed to configure AWS CLI:', err);
  process.exit(1);
}
