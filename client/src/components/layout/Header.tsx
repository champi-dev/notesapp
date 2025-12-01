import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Menu,
  Sun,
  Moon,
  Monitor,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { Dropdown, DropdownItem } from '../common/Dropdown';
import { useAuthStore, useUIStore, useNoteStore } from '../../stores';
import { cn } from '../../lib/utils';

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, setTheme, toggleSidebar } = useUIStore();
  const { setFilter, filters } = useNoteStore();
  const [searchValue, setSearchValue] = useState(filters.search);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter({ search: searchValue });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between px-4 gap-4">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900 dark:text-white hidden sm:block">
            NoteFlow
          </span>
        </div>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex-1 max-w-xl mx-4"
      >
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => {
                setSearchValue('');
                setFilter({ search: '' });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded">ESC</span>
            </button>
          )}
        </div>
      </form>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <Dropdown
          trigger={
            <button className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              {theme === 'light' && <Sun className="w-5 h-5" />}
              {theme === 'dark' && <Moon className="w-5 h-5" />}
              {theme === 'system' && <Monitor className="w-5 h-5" />}
            </button>
          }
          align="right"
        >
          {themes.map((t) => (
            <DropdownItem
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={cn(theme === t.value && 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400')}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </DropdownItem>
          ))}
        </Dropdown>

        {/* User menu */}
        <Dropdown
          trigger={
            <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </button>
          }
          align="right"
        >
          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
            <p className="font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
          </div>
          <DropdownItem onClick={handleLogout} danger>
            <LogOut className="w-4 h-4" />
            Sign out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
}
