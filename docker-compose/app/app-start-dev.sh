#!/bin/bash
echo "Running startup script..."
npm run db:migrate:dev && npm run db:seed;
npm run dev:ts-node;
