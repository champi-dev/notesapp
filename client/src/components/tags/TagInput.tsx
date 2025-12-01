import { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { useTagStore } from '../../stores';
import { cn } from '../../lib/utils';
import { MAX_TAGS_PER_NOTE, MAX_TAG_LENGTH } from '../../lib/constants';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export function TagInput({ tags, onChange }: TagInputProps) {
  const { tags: allTags } = useTagStore();
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter suggestions
  const suggestions = inputValue
    ? allTags
        .filter(
          (t) =>
            t.name.toLowerCase().includes(inputValue.toLowerCase()) &&
            !tags.includes(t.name)
        )
        .slice(0, 5)
    : [];

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (tagName: string) => {
    const normalizedTag = tagName.toLowerCase().trim().slice(0, MAX_TAG_LENGTH);
    if (normalizedTag && !tags.includes(normalizedTag) && tags.length < MAX_TAGS_PER_NOTE) {
      onChange([...tags, normalizedTag]);
    }
    setInputValue('');
    setShowSuggestions(false);
    setSelectedIndex(0);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (suggestions.length > 0 && showSuggestions) {
        addTag(suggestions[selectedIndex].name);
      } else if (inputValue) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === 'ArrowDown' && showSuggestions) {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp' && showSuggestions) {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Existing tags */}
        {tags.map((tag) => (
          <span key={tag} className="tag-removable group animate-scale-in">
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-1 hover:text-primary-600 dark:hover:text-primary-300"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {/* Input */}
        {tags.length < MAX_TAGS_PER_NOTE && (
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
                setSelectedIndex(0);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder={tags.length === 0 ? 'Add tags...' : ''}
              className="w-24 px-2 py-1 text-sm bg-transparent border-none outline-none placeholder:text-gray-400"
            />

            {/* Add button for mobile */}
            {inputValue && (
              <button
                onClick={() => addTag(inputValue)}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-primary-500 hover:text-primary-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 mt-1 w-48 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 animate-fade-in-down">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.name}
              onClick={() => addTag(suggestion.name)}
              className={cn(
                'w-full px-3 py-1.5 text-left text-sm flex items-center justify-between',
                'hover:bg-gray-100 dark:hover:bg-gray-700',
                index === selectedIndex && 'bg-gray-100 dark:bg-gray-700'
              )}
            >
              <span>{suggestion.name}</span>
              <span className="text-xs text-gray-400">{suggestion.count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
