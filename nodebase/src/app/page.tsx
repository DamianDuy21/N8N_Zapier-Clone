import LogoutButton from "@/features/auth/components/LogoutButton";
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";

const Page = async () => {
  await requireAuth();
  const data = await caller.getUsers();
  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center">
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <LogoutButton />
    </div>
  );
};

export default Page;
