import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

// Ensure the prisma client is re-used during development to prevent exhausting database connections.
// production code should not use this pattern because there is no hot reloading.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
