import js from '@eslint/js';
import { config as baseConfig } from '@repo/eslint-config/base';
import tseslint from 'typescript-eslint';

export default tseslint.config(...baseConfig, {
  files: ['src/**/*.ts', 'src/**/*.mts'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
});
