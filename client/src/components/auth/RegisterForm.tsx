import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { useAuthStore, useUIStore } from '../../stores';

export function RegisterForm() {
  const navigate = useNavigate();
  const register = useAuthStore((s) => s.register);
  const addToast = useUIStore((s) => s.addToast);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain an uppercase letter';
    if (!/[0-9]/.test(pwd)) return 'Password must contain a number';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Client-side validation
    const newErrors: Record<string, string> = {};

    if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, name);
      addToast({ type: 'success', message: 'Account created successfully!' });
      navigate('/app');
    } catch (error: any) {
      const data = error.response?.data?.error;
      if (data?.code === 'AUTH_002') {
        setErrors({ email: 'This email is already registered' });
      } else if (data?.details) {
        const fieldErrors: Record<string, string> = {};
        data.details.forEach((d: { field: string; message: string }) => {
          fieldErrors[d.field] = d.message;
        });
        setErrors(fieldErrors);
      } else {
        addToast({ type: 'error', message: data?.message || 'Registration failed' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (): { label: string; color: string; width: string } => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    if (password.length >= 12) score++;

    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
    if (score <= 2) return { label: 'Fair', color: 'bg-yellow-500', width: 'w-1/2' };
    if (score <= 3) return { label: 'Good', color: 'bg-blue-500', width: 'w-3/4' };
    return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
  };

  const strength = password ? getPasswordStrength() : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        leftIcon={<User className="w-5 h-5" />}
        error={errors.name}
        required
        autoComplete="name"
      />

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        leftIcon={<Mail className="w-5 h-5" />}
        error={errors.email}
        required
        autoComplete="email"
      />

      <div>
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          leftIcon={<Lock className="w-5 h-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
          error={errors.password}
          required
          autoComplete="new-password"
        />

        {/* Password strength indicator */}
        {password && strength && (
          <div className="mt-2 space-y-1 animate-fade-in">
            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${strength.color} transition-all duration-300 rounded-full`}
                style={{ width: strength.width === 'w-full' ? '100%' : strength.width === 'w-3/4' ? '75%' : strength.width === 'w-1/2' ? '50%' : '25%' }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Password strength: <span className="font-medium">{strength.label}</span>
            </p>
          </div>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={isLoading}
      >
        Create account
      </Button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
