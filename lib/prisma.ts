import { PrismaClient } from '@prisma/client';

declare global {
  // allow global `var` across hot-reloads in dev
  var prisma: PrismaClient | undefined;
}

// Helper to fix protocol
const getFixedDatabaseUrl = () => {
  let url = process.env.DATABASE_URL;
  if (!url) return undefined;

  // Explicitly fix common protocol issues for Vercel/Neon
  if (url.startsWith('neondb://')) {
    console.log('[Prisma] Patching neondb:// protocol to postgresql://');
    return url.replace('neondb://', 'postgresql://');
  }

  // Fallback for any other non-standard protocol
  if (!url.startsWith('postgres://') && !url.startsWith('postgresql://')) {
    console.warn('[Prisma] Suspicious protocol detected, attempting to force postgresql://');
    return url.replace(/^.+:\/\//, 'postgresql://');
  }

  return url;
};

const fixedUrl = getFixedDatabaseUrl();

const prisma = global.prisma || new PrismaClient({
  log: ['query', 'error', 'warn'],
  datasources: fixedUrl ? {
    db: {
      url: fixedUrl,
    },
  } : undefined,
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
