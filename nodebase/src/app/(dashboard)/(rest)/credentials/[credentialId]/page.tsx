import { requireAuth } from "@/lib/auth-utils";

interface RestCredentialIdPageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

const RestCredentialIdPage = async ({ params }: RestCredentialIdPageProps) => {
  await requireAuth();
  const { credentialId } = await params;

  return <div>Rest Credential ID Page: {credentialId}</div>;
};

export default RestCredentialIdPage;
