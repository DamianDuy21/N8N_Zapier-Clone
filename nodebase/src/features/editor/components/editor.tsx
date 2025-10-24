"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspendedWorkflow } from "@/features/workflows/hooks/use-workflows";

export const EditorLoading = () => {
  return <LoadingView message="Loading editor..." />;
};

export const EditorError = () => {
  return <ErrorView message="Failed to load editor" />;
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspendedWorkflow(workflowId);

  return (
    <div>
      <h1>Editor Workflow ID Page: {workflowId}</h1>
      <pre>{JSON.stringify(workflow, null, 2)}</pre>
    </div>
  );
};
