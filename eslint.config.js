import { defineConfig } from 'eslint/config';
import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

// mimic CommonJS variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default defineConfig([
  // Load the existing .eslintrc.js configuration using FlatCompat
  ...compat.extends('./.eslintrc.js'),
]);
