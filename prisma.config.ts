import path from 'node:path';
import type { PrismaConfig } from 'prisma';

// Gyllene Kuben — Prisma v7 Configuration
// See: https://pris.ly/d/config-datasource

export default {
  schema: path.join(__dirname, 'prisma/schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL!,
  },
} satisfies PrismaConfig;
