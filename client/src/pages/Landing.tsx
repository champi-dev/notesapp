import { Link } from 'react-router-dom';
import {
  Sparkles,
  FileText,
  FolderTree,
  Search,
  Moon,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Button } from '../components/common/Button';

const features = [
  {
    icon: FileText,
    title: 'Rich Text Editing',
    description: 'Format your notes with headings, lists, code blocks, and more.',
  },
  {
    icon: FolderTree,
    title: 'Smart Organization',
    description: 'Organize notes with folders and tags for easy retrieval.',
  },
  {
    icon: Search,
    title: 'Powerful Search',
    description: 'Find any note instantly with full-text search.',
  },
  {
    icon: Moon,
    title: 'Dark Mode',
    description: 'Easy on the eyes with beautiful light and dark themes.',
  },
];

const benefits = [
  'Free forever for personal use',
  'Auto-save as you type',
  'Access from any device',
  'Export your notes anytime',
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900 dark:text-white">
                NoteFlow
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/2 -left-20 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-20 right-1/3 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 rounded-full text-primary-600 dark:text-primary-400 text-sm font-medium mb-6 animate-fade-in-down">
            <Sparkles className="w-4 h-4" />
            <span>Your thoughts, beautifully organized</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 animate-fade-in-up leading-tight">
            Write notes that
            <span className="text-gradient"> flow</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            A beautiful, intuitive note-taking app that helps you capture ideas, stay organized, and focus on what matters most.
          </p>

          <div className="flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/register">
              <Button variant="primary" size="lg" className="shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/30">
                Start Writing Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-10 text-sm text-gray-500 dark:text-gray-400">
            {benefits.map((benefit, i) => (
              <div key={benefit} className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                <Check className="w-4 h-4 text-green-500" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* App Preview */}
        <div className="max-w-5xl mx-auto mt-20 relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
            <div className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-8">
              {/* Mock app interface */}
              <div className="h-full rounded-xl bg-white dark:bg-gray-800 shadow-lg flex overflow-hidden">
                {/* Sidebar mock */}
                <div className="w-56 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 p-4">
                  <div className="space-y-2">
                    <div className="h-10 bg-primary-500 rounded-lg shimmer" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-2/3" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-4/5" />
                  </div>
                </div>
                {/* Note list mock */}
                <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4">
                  <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`p-3 rounded-lg ${i === 1 ? 'bg-primary-50 dark:bg-primary-900/20 ring-2 ring-primary-500' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                        <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-full" />
                        <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-2/3 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Editor mock */}
                <div className="flex-1 p-6">
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-full" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-5/6" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-4/5" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-full" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-primary-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl -z-10 opacity-50" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to stay organized
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful features wrapped in a beautiful, intuitive interface.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card p-6 hover-lift animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of users who trust NoteFlow for their note-taking needs.
          </p>
          <Link to="/register">
            <Button variant="primary" size="lg" className="shadow-xl shadow-primary-500/25">
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">NoteFlow</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Built with love for note-takers everywhere
          </p>
        </div>
      </footer>
    </div>
  );
}
