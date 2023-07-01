import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

export interface Context {
  prisma: PrismaClient;
}

export const context: Context = {
  prisma,
};
