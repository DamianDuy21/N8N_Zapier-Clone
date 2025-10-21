import { requireAuth } from "@/lib/auth-utils";

interface RestExecutionIdPageProps {
  params: Promise<{
    executionId: string;
  }>;
}

const RestExecutionIdPage = async ({ params }: RestExecutionIdPageProps) => {
  await requireAuth();
  const { executionId } = await params;

  return <div>Rest Execution ID Page: {executionId}</div>;
};

export default RestExecutionIdPage;
