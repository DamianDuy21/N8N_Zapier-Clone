import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";
export const useSuspendedWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();
  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
};

export const useCreateWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: async (data) => {
        toast.success(`Workflow ${data.name} created successfully!`);

        await queryClient.invalidateQueries(
          trpc.workflows.getMany.queryOptions({})
        );
      },
      onError: () => {
        toast.error("Failed to create workflow. Please try again.");
      },
    })
  );
};

export const useRemoveWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess: async (data) => {
        toast.success(`Workflow ${data.name} deleted successfully!`);

        await queryClient.invalidateQueries(
          trpc.workflows.getMany.queryOptions({})
        );
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryFilter({ id: data.id })
        );
      },
      onError: () => {
        toast.error("Failed to delete workflow. Please try again.");
      },
    })
  );
};
