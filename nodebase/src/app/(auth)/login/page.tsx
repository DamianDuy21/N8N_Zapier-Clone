import LoginForm from "@/features/auth/components/LoginForm";
import { requireUnAuth } from "@/lib/auth-utils";

const LoginPage = async () => {
  await requireUnAuth();
  return (
    <>
      <LoginForm />
    </>
  );
};

export default LoginPage;
