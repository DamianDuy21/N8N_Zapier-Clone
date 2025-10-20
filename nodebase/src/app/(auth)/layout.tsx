import AuthLayout from "@/features/auth/components/AuthLayout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default Layout;
