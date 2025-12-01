import { AuthLayout, LoginForm } from '../components/auth';

export function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue to your notes"
    >
      <LoginForm />
    </AuthLayout>
  );
}
