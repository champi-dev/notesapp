import { AuthLayout, RegisterForm } from '../components/auth';

export function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start organizing your thoughts today"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
