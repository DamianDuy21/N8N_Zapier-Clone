import { requireAuth } from "@/lib/auth-utils";

const RestExecutionsPage = async () => {
  await requireAuth();
  return <div>Rest Executions Page</div>;
};

export default RestExecutionsPage;
