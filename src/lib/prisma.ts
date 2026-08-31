// Safe dynamic Prisma Client loader for both server runtime and CI/CD builds
let PrismaClientConstructor: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const prismaPkg = require("@prisma/client");
  PrismaClientConstructor = prismaPkg?.PrismaClient || null;
} catch {
  PrismaClientConstructor = null;
}

const globalForPrisma = globalThis as unknown as {
  prisma: any;
};

export function getPrisma(): any {
  if (globalForPrisma.prisma !== undefined) {
    return globalForPrisma.prisma;
  }

  if (!PrismaClientConstructor) {
    globalForPrisma.prisma = null;
    return null;
  }

  try {
    const client = new PrismaClientConstructor({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
    if (process.env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    }
    return client;
  } catch {
    globalForPrisma.prisma = null;
    return null;
  }
}

export const prisma = getPrisma();
