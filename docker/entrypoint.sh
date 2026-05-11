#!/bin/sh
set -e

echo "──────────────────────────────────────────────"
echo " Running Prisma migrations…"
echo "──────────────────────────────────────────────"
npx prisma migrate deploy

echo "──────────────────────────────────────────────"
echo " Starting application…"
echo "──────────────────────────────────────────────"
exec "$@"
