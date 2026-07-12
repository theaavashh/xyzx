#!/bin/sh
set -e

echo "[entrypoint] Pushing Prisma schema..."
prisma migrate deploy

echo "[entrypoint] Auto-creating admin user..."
tsx src/scripts/auto-create-admin.ts

echo "[entrypoint] Starting application..."
exec node dist/index.js
