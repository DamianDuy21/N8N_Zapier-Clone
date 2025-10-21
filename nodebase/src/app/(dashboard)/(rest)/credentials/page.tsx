import { requireAuth } from "@/lib/auth-utils";

const RestCredentialsPage = async () => {
  await requireAuth();
  return <div>Rest Credentials Page</div>;
};

export default RestCredentialsPage;
