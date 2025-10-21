import { requireAuth } from "@/lib/auth-utils";

interface EditorWorkflowIdPageProps {
  params: Promise<{
    workflowId: string;
  }>;
}

const EditorWorkflowIdPage = async ({ params }: EditorWorkflowIdPageProps) => {
  await requireAuth();
  const { workflowId } = await params;

  return <div>Editor Workflow ID Page: {workflowId}</div>;
};

export default EditorWorkflowIdPage;
