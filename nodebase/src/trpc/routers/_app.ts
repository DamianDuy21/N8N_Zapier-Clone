import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "../init";

export const appRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(({ ctx }) => {
    return prisma.user.findMany({ where: { id: ctx.auth.user.id } });
  }),
  testAI: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai",
      data: {},
    });
    return { success: true, message: "AI execution initiated." };
  }),
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),
  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "damianduy1302@gmail.com",
      },
    });

    return { success: true, message: "Workflow creation initiated." };
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
