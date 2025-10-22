import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
export const useSuspendedWorkflows = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.workflows.getMany.queryOptions());
};

export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: async (data) => {
        toast.success(`Workflow ${data.name} created successfully!`);

        await queryClient.invalidateQueries(
          trpc.workflows.getMany.queryOptions()
        );
      },
      onError: () => {
        toast.error("Failed to create workflow. Please try again.");
      },
    })
  );
};
