import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="text-center animate-fade-in-up">
        <div className="relative">
          <h1 className="text-[12rem] font-bold text-gray-100 dark:text-gray-800 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                Page not found
              </p>
              <p className="text-gray-500 dark:text-gray-400">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8">
          <Button
            variant="secondary"
            onClick={() => window.history.back()}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Go Back
          </Button>
          <Link to="/">
            <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
