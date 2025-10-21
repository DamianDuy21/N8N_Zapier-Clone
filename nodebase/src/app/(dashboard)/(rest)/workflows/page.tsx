import { requireAuth } from "@/lib/auth-utils";

const RestWorkflowsPage = async () => {
  await requireAuth();
  return <div>Rest Workflows Page</div>;
};

export default RestWorkflowsPage;
