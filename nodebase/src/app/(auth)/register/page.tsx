import RegisterForm from "@/features/auth/components/RegisterForm";
import { requireUnAuth } from "@/lib/auth-utils";

const RegisterPage = async () => {
  await requireUnAuth();
  return (
    <div>
      <RegisterForm></RegisterForm>
    </div>
  );
};

export default RegisterPage;
